function wordsComparator(sort) {
    switch (sort) {
        case 'alphabet':
            return function (a, b) {
                if (a[0] < b[0]) return -1;
                else if (a[0] > b[0]) return 1;
                else return 0;
            };
        case 'rev_alphabet':
            return function (a, b) {
                if (a[0] > b[0]) return -1;
                else if (a[0] < b[0]) return 1;
                else return 0;
            };
        case 'frequency':
            return function (a, b) {
                return a[1].freq - b[1].freq;
            };
        case 'rev_frequency':
            return function (a, b) {
                return b[1].freq - a[1].freq;
            };
        default:
            return function (a, b) {
                if (a[0] < b[0]) return -1;
                else if (a[0] > b[0]) return 1;
                else return 0;
            };
    }
}

export default wordsComparator;