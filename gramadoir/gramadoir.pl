#!/usr/bin/perl -wT
use strict;
use warnings;
use utf8;
use CGI::Fast qw/:standard/;
use DateTime;
use JSON qw( to_json );
use Encode qw( encode decode FB_CROAK LEAVE_SRC );
use Log::Dispatch::File;
use Date::Format;
use Lingua::GA::Gramadoir;

my $VERSION = '0.70';
$CGI::DISABLE_UPLOADS = 1;
$CGI::POST_MAX = 16384;
$ENV{PATH}="/bin:/usr/bin";
delete @ENV{ 'IFS', 'CDPATH', 'ENV', 'BASH_ENV' };
my $logfile = "/tmp/gram-api.log";

binmode STDIN, ":utf8";
binmode STDOUT, ":utf8";
binmode STDERR, ":utf8";

# arg looks like: ( message => $log_message, level => $log_level )
# just return the modified scalar message
sub log_callback {
        my %p = @_;
        return Date::Format::time2str('%Y-%m-%d %T', time)." (".$p{'level'}.") ".$p{'message'}."\n";
}

my $log = Log::Dispatch->new(callbacks => \&log_callback);
die unless $log;
$log->add(Log::Dispatch::File->new(
        'name' => 'log1',
        'min_level' => 'info',
        'binmode' => ':utf8',
        'filename' => $logfile,
        'mode' => 'append',
));

# these are only used in HTTP response, not for server-side logs
my %msg = (200 => 'OK',
        400 => 'Bad Request',
        403 => 'Forbidden',
        405 => 'Method Not Allowed',
        413 => 'Payload Too Large',
        500 => 'Internal Server Error',
);

# only called once per call to the script and terminates
# in case of an error, logs it, and returns an empty JSON array
# if not an error, write to log and returns JSON version of the array passed in
# this function contains the only output from the CGI;
# note it doesn't need the CGI object, just print to stdout
sub finish {
        (my $cgi, my $aref, my $httpcode, my $logmsg) = @_;
        my $ip = $ENV{'REMOTE_ADDR'};
        if ($httpcode >= 500) {
                $log->error("$ip [$httpcode] $logmsg");
        }
        elsif ($httpcode >= 400) {
                $log->warning("$ip [$httpcode] $logmsg");
        }
        else { # 200
                $log->info("$ip [$httpcode] $logmsg");
        }
        print $cgi->header(-type=>'application/json',
                -status => "$httpcode $msg{$httpcode}",
                #-access_control_allow_origin => '*',
                #HB        
                #-access_control_allow_headers => 'content-type,X-Requested-With',
                #-access_control_allow_methods => 'POST,OPTIONS',

                -charset=>'UTF-8',
        );
        print to_json($aref);
        exit 0;
}

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

my $q = new CGI;
my $teacs = $q->param('teacs');

my $comheadan = $q->param('teanga');
$comheadan =~ s/_[A-Z][A-Z]$//;
my $cliant = $q->param('cliant');
$cliant = 'unspecified' if (!defined($cliant));

# request must pass through the following gauntlet of checks
# before it can create the Lingua::GA::Gramadoir object and get to work

# if POST_MAX is exceeded, no parameters get defined; check that here
# Also note that if the POST is bigger than 120,000 bytes, server
# automatically returns a 500 error, not a 413; code below
# gets run (and 413 gets logged) in either case
if (!defined($teacs)) {
        if (exists($ENV{'CONTENT_LENGTH'}) and $ENV{'CONTENT_LENGTH'} > $CGI::POST_MAX) {
                finish($q, [], 413, "POST request with $ENV{'CONTENT_LENGTH'} bytes exceeds maximum allowed");
        }
        else {
                finish($q, [], 400, 'No source text parameter in request');
        }
}
finish($q, [], 405, 'Only POST requests allowed') unless ($ENV{'REQUEST_METHOD'} eq 'POST');
finish($q, [], 400, 'Empty source text in request') if (length($teacs) == 0);
finish($q, [], 400, 'No source language parameter in request') unless (defined($comheadan));
finish($q, [], 400, "Unsupported interface language $comheadan") unless ($comheadan =~ m/^(af|cy|da|de|en|eo|es|fi|fr|ga|hu|id|mn|nl|ro|sk|sv|vi|zh)$/);
my $input = eval { decode('UTF-8', $teacs, FB_CROAK | LEAVE_SRC) };
finish($q, [], 400, 'Source text is not valid UTF-8') unless (defined($input));

my $gr = new Lingua::GA::Gramadoir(
        fix_spelling => 1,
        use_ignore_file => 0,
        unigram_tagging => 1,
        interface_language => $comheadan,
        input_encoding => 'utf-8',
);

my $errs = $gr->grammatical_errors(encode('UTF-8', to_latin1_range($input)));
my @errs_json;
foreach my $error (@$errs) {
        (my $fy, my $fx, my $toy, my $tox, my $ruleId, my $msg, my $context, my $contextoffset, my $errorlength) = $error =~ m/^<error fromy="([0-9]+)" fromx="([0-9]+)" toy="([0-9]+)" tox="([0-9]+)" ruleId="([^"]+)" msg="([^"]+)".* context="([^"]+)" contextoffset="([0-9]+)" errorlength="([0-9]+)"\/>$/;
        my $errortext = substr($context,$contextoffset,$errorlength);
        push @errs_json, {'fromy' => $fy,
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

my $len=length($input);  # report length of Unicode string
my $count=scalar(@errs_json);
finish($q, \@errs_json, 200, "Checked text of length $len, found $count errors; client=$cliant");

exit 0;