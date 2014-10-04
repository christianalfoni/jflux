/*
 *  ACTIONS
 */
var actions = $$.action([
  'sort',
  'filter'
  ]);

/*
 *  STORE
 */
var ListStore = $$.store(function () {

  var list = getNames();
  var filter = '';

  this.sort = function (increasing) {
    list.sort(function (a, b) {
      if (increasing) {
        if(a.firstName.toLowerCase() < b.firstName.toLowerCase()) return -1;
        if(a.firstName.toLowerCase() > b.firstName.toLowerCase()) return 1;
        return 0;
      } else {
        if(a.firstName.toLowerCase() > b.firstName.toLowerCase()) return -1;
        if(a.firstName.toLowerCase() < b.firstName.toLowerCase()) return 1;
        return 0;
      }
    });
    this.emit('update');
  };

  this.setFilter = function (newFilter) {
    filter = newFilter;
    this.emit('update');
  };

  this.listenTo(actions.sort, this.sort);
  this.listenTo(actions.filter, this.setFilter);

  return {
    getList: function () {
      if (filter) {
        return list.filter(function (person) {
          return person.firstName.toLowerCase().substr(0, filter.length) === filter.toLowerCase();
        });
      } else {
        return list;
      }
    }
  };
});

/*
 *  COMPONENT
 */
var List = $$.component({
  filterValue: '',
  events: {
    'keyup :text': 'filter',
    'click #sort-inc': 'sortIncreasing',
    'click #sort-dec': 'sortDecreasing'
  },
  bindings: {
    ':text': 'filterValue'
  },
  init: function () {
    this.listenTo(ListStore, 'update', this.update);
  },
  sortIncreasing: function () {
    actions.sort(true);
  },
  sortDecreasing: function () {
    actions.sort(false);
  },
  filter: function () {
    actions.filter(this.filterValue);
  },
  compileNames: function (compile) {
    return compile(
      '<li>',
        this.item.firstName + ' ' + this.item.lastName,
      '</li>'
    )
  },
  render: function (compile) {
  var list = this.map(ListStore.getList(), this.compileNames);
    return compile(
      '<div>',
        '<button id="sort-inc">Sort inc</button>',
        '<button id="sort-dec">Sort dec</button>',
        '<input id="filter" $$-value="filterValue"/>',
        '<ul>',
          list,
        '</ul>',
      '</div>'
    )
  }
});

$(function () {
  $$.render(List(), 'body');
});

/*
 *  A LIST OF NAMES
 */

function getNames () {
  return [
  {
    "_id": "5407a663222c1d6a331d0f9c",
    "firstName": "Harding",
    "lastName": "Bradshaw"
  },
  {
    "_id": "5407a6636b1271dcf293cb6a",
    "firstName": "Mabel",
    "lastName": "Patterson"
  },
  {
    "_id": "5407a663a59dc811d36bdd6e",
    "firstName": "Darlene",
    "lastName": "Wise"
  },
  {
    "_id": "5407a663a446d4f66068ec04",
    "firstName": "Weaver",
    "lastName": "Jacobs"
  },
  {
    "_id": "5407a66395b6cd50232cbd92",
    "firstName": "Schwartz",
    "lastName": "Woodard"
  },
  {
    "_id": "5407a6634f6bb3cf1ea736b6",
    "firstName": "Belinda",
    "lastName": "Kline"
  },
  {
    "_id": "5407a6630c7b025b26d3d204",
    "firstName": "Lucinda",
    "lastName": "Bentley"
  },
  {
    "_id": "5407a66379e9977cee6c631d",
    "firstName": "Susana",
    "lastName": "Stevens"
  },
  {
    "_id": "5407a663f21c1a37a6060b2c",
    "firstName": "Colette",
    "lastName": "Rowland"
  },
  {
    "_id": "5407a6639df76d8ed2504d9e",
    "firstName": "Morton",
    "lastName": "Finley"
  },
  {
    "_id": "5407a6637c0daf3f56a8acae",
    "firstName": "Reba",
    "lastName": "Hopper"
  },
  {
    "_id": "5407a6637ddcbee630aacd5f",
    "firstName": "Diann",
    "lastName": "Mccormick"
  },
  {
    "_id": "5407a66383118841626b5d3a",
    "firstName": "Joy",
    "lastName": "Whitaker"
  },
  {
    "_id": "5407a663408d5d208a271c61",
    "firstName": "Britney",
    "lastName": "Mccall"
  },
  {
    "_id": "5407a663f1c58d9e67f790d1",
    "firstName": "Benita",
    "lastName": "Velez"
  },
  {
    "_id": "5407a66315097f95bff6f524",
    "firstName": "English",
    "lastName": "Key"
  },
  {
    "_id": "5407a663cdf00898cb07e8bf",
    "firstName": "Wallace",
    "lastName": "Richards"
  },
  {
    "_id": "5407a66332a3ff7ae81dfffe",
    "firstName": "Smith",
    "lastName": "Good"
  },
  {
    "_id": "5407a663764748de115cff1f",
    "firstName": "Hood",
    "lastName": "Hoover"
  },
  {
    "_id": "5407a6638794cbd5131f1e57",
    "firstName": "Alyssa",
    "lastName": "Curry"
  },
  {
    "_id": "5407a6636cb7a91a68ff4c38",
    "firstName": "Angie",
    "lastName": "Chapman"
  },
  {
    "_id": "5407a6639da55306199d603a",
    "firstName": "Tameka",
    "lastName": "Alston"
  },
  {
    "_id": "5407a663d7eb6ed2c978839b",
    "firstName": "Marianne",
    "lastName": "Clarke"
  },
  {
    "_id": "5407a663c1f238ec909d42a2",
    "firstName": "Jones",
    "lastName": "Hogan"
  },
  {
    "_id": "5407a6639f5a8cf7e7bba1a6",
    "firstName": "Gordon",
    "lastName": "Munoz"
  },
  {
    "_id": "5407a663570e0331ab5b83af",
    "firstName": "Dolly",
    "lastName": "Mayer"
  },
  {
    "_id": "5407a663a61b88726bba9977",
    "firstName": "Wooten",
    "lastName": "Estes"
  },
  {
    "_id": "5407a663ffd8439afd61f54b",
    "firstName": "Mae",
    "lastName": "Soto"
  },
  {
    "_id": "5407a6632c2bcb0685aeaf8e",
    "firstName": "Wolf",
    "lastName": "Contreras"
  },
  {
    "_id": "5407a663c78633b273768964",
    "firstName": "Leola",
    "lastName": "Wynn"
  },
  {
    "_id": "5407a66320455dbee796d072",
    "firstName": "Yesenia",
    "lastName": "Bird"
  },
  {
    "_id": "5407a66367b6ca57d64696a7",
    "firstName": "Conley",
    "lastName": "Beck"
  },
  {
    "_id": "5407a6634b6045cb286f5aba",
    "firstName": "Antoinette",
    "lastName": "Rivera"
  },
  {
    "_id": "5407a663498043c494b9d310",
    "firstName": "Duran",
    "lastName": "Hurley"
  },
  {
    "_id": "5407a66329a6efa1ce32ff0b",
    "firstName": "Dorothea",
    "lastName": "Le"
  },
  {
    "_id": "5407a663b029ba56dfdfcef0",
    "firstName": "Charmaine",
    "lastName": "Barrera"
  },
  {
    "_id": "5407a663d26245f6af0fdde5",
    "firstName": "Beatriz",
    "lastName": "Shields"
  },
  {
    "_id": "5407a663048cdcc4015f96cd",
    "firstName": "Janelle",
    "lastName": "Wagner"
  },
  {
    "_id": "5407a66339c6b36f127e902d",
    "firstName": "Luna",
    "lastName": "Spears"
  },
  {
    "_id": "5407a663251f032142fff37d",
    "firstName": "Kimberly",
    "lastName": "Potts"
  },
  {
    "_id": "5407a663b87c094ad7752306",
    "firstName": "Claire",
    "lastName": "Frye"
  },
  {
    "_id": "5407a6633e109b6b64103ba4",
    "firstName": "Bettie",
    "lastName": "Howard"
  },
  {
    "_id": "5407a6632bd7dbf07f808051",
    "firstName": "Saundra",
    "lastName": "Lindsay"
  },
  {
    "_id": "5407a663033315110a01a8e3",
    "firstName": "Lesa",
    "lastName": "Charles"
  },
  {
    "_id": "5407a6635c454527c1c32ad4",
    "firstName": "Sanchez",
    "lastName": "Robles"
  },
  {
    "_id": "5407a663c68ec020674347a3",
    "firstName": "Shaw",
    "lastName": "Johnston"
  },
  {
    "_id": "5407a6630275e23270dcbb17",
    "firstName": "Ballard",
    "lastName": "Figueroa"
  },
  {
    "_id": "5407a66314ffc966d5e65a2e",
    "firstName": "Berg",
    "lastName": "Blevins"
  },
  {
    "_id": "5407a6634628ed3cd24bc59e",
    "firstName": "Sadie",
    "lastName": "Rush"
  },
  {
    "_id": "5407a6637778cfeacc5e4b08",
    "firstName": "Lily",
    "lastName": "Cain"
  }
  ]
}