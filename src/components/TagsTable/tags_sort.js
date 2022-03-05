function sortComparator(name) {
    switch (name) {
        case 'alphabet':
            return function (a, b) {
                if (a.code < b.code) return -1;
                else if (a.code > b.code) return 1;
                else if (a.tag < b.tag) return -1;
                else if (a.tag > b.tag) return 1;
                else return 0;
            };
        case 'rev_alphabet':
            return function (a, b) {
                if (a.code > b.code) return -1;
                else if (a.code < b.code) return 1;
                else if (a.tag > b.tag) return -1;
                else if (a.tag < b.tag) return 1;
                else return 0;
            };
        case 'frequency':
            return function (a, b) {
                if (a.tag_freq < b.tag_freq) return -1;
                else if (a.tag_freq > b.tag_freq) return 1;
                else if (a.code < b.code) return -1;
                else if (a.code > b.code) return 1;
                else if (a.tag < b.tag) return -1;
                else if (a.tag > b.tag) return 1;
                else return 0;
            };
        case 'rev_frequency':
            return function (a, b) {
                if (a.tag_freq > b.tag_freq) return -1;
                else if (a.tag_freq < b.tag_freq) return 1;
                else if (a.code > b.code) return -1;
                else if (a.code < b.code) return 1;
                else if (a.tag > b.tag) return -1;
                else if (a.tag < b.tag) return 1;
                else return 0;
            };
        default:
            return function (a, b) {
                if (a.code < b.code) return -1;
                else if (a.code > b.code) return 1;
                else if (a.tag < b.tag) return -1;
                else if (a.tag > b.tag) return 1;
                else return 0;
            };
    }
}

export default sortComparator;