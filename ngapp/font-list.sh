cat src/quill.fonts.css | grep before | grep -o "'[A-Za-z-]\+'" | uniq | sed -E 's/^/\t\t/' | sed -E 's/$/,/'
