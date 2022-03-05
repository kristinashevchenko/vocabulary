export const sortFunc = (sortType) => {
    switch(sortType) {
        case 'sort_alph': {
            return (a, b) => {
                if (a[0] < b[0]) return -1;
                else if (a[0] > b[0]) return 1;
                else return 0;
            };
        }
        case 'sort_alph_rev': {
            return (a, b) => {
                if (a[0] > b[0]) return -1;
                else if (a[0] < b[0]) return 1;
                else return 0;
            };
        }
        case 'sort_rev': {
            return (a, b) => {
                if (a[1].amount < b[1].amount) return 1;
                else if (a[1].amount > b[1].amount) return -1;
                else return 0;
            }
        }
        case 'sort_freq_rev': {
            return (a, b) => {
                if (a[1].amount > b[1].amount) return 1;
                else if (a[1].amount < b[1].amount) return -1;
                else return 0;
            }
        }
    }

};