import moment from "moment";

export default () => ({
  filters: {
    names: [
      `everything`,
      `future`,
      `past`,
    ],
    isChecked: `everything`,
  },
  sorting: {
    names: [
      `event`,
      `time`,
      `price`,
    ],
    isChecked: `event`,
  },
  newPoint: {
    'base_price': ``,
    'type': `taxi`,
    'destination': {
      'description': [],
      'name': ``,
      'pictures': [],
      'id': ``,
      'is_favorite': false,
    },
    'date_from': moment(),
    'date_to': moment(),
    'offers': []
  }
});
