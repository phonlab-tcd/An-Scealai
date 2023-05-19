use lib ".";
use JSON qw( to_json );
use Encode qw( encode decode FB_CROAK LEAVE_SRC );
use Dancer2;
use OurGramadoir;

# create an instance of OurGramadoir
my $gr = new OurGramadoir();

set serializer => 'JSON';
set port => $ENV{'port'};

# perl unicode strings to perl unicode strings
# surveyed most common codepoints above 00FF in Tuairisc for this
# below includes everything appearing >= 100 times as of Apr 2018
# (and these are all in thousands!)
sub to_latin1_range {
	(my $txt) = @_;
	for ($txt) {
		s/–/-/g; # U+2013
		s/—/-/g; # U+2014
		s/‘/'/g; # U+2018
		s/’/'/g; # U+2019
		s/“/"/g; # U+201C
		s/”/"/g; # U+201D
		s/…/./g; # U+2026  (want to preserve length for offsets :/)
		s/€/E/g; # U+20AC
		s/\x{0D}\x{0A}/\n/g;  # CGI adds these?
	}
	return $txt;
}

sub gram_errors_to_json {
    my ($input) = @_;
    
    my $errs = $gr->grammatical_errors(encode('UTF-8', to_latin1_range($input)));
    my @errs_json;

    foreach my $error (@$errs) {
        (my $fy, my $fx, my $toy, my $tox, my $ruleId, my $msg, my $context, my $contextoffset, my $errorlength) = $error =~ m/^<error fromy="([0-9]+)" fromx="([0-9]+)" toy="([0-9]+)" tox="([0-9]+)" ruleId="([^"]+)" msg="([^"]+)".* context="([^"]+)" contextoffset="([0-9]+)" errorlength="([0-9]+)"\/>$/;
        
        my $errortext = substr($context, $contextoffset, $errorlength);

        push @errs_json, {
            'fromy' => $fy,
            'fromx' => $fx,
            'toy' => $toy,
            'tox' => $tox,
            'ruleId' => $ruleId,
            'msg' => $msg,
            'context' => $context,
            'contextoffset' => $contextoffset,
            'errorlength' => $errorlength,
            'errortext' => $errortext,
        };
    }

    return \@errs_json;
}


get '/check/:sentence' => sub {
    my $sentence = route_parameters->get('sentence');

    my $errors = $gr->grammatical_errors($sentence);

    my $errors_json = gram_errors_to_json($errors);

    return $errors_json;
};

start;
