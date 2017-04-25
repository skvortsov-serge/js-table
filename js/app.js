 // option logic
 function renderPosts(posts) {
     var td = [];
     posts.forEach(function(el) {
         td.push('<td>' + el.name + '</td>', '<td>' + el.email + '</td>', '<td>' + el.body + '</td>');
     });
     return td;
 }

 function updatePosts(posts, p) {
     var table = renderPosts(posts);
     var getTr = document.querySelectorAll('.table' + p + ' table tbody');

     deleteElements(getTr[0]);

     function creatingNewTr(table) {
         var pushedTr = '';
         var newTr = document.createElement('tr');
         var tbody = document.querySelector('.table' + p + ' tbody');
         tbody.appendChild(newTr);

         //----------- making 3 columns----------
         if (tbody.lastChild.nodeType <= 3) {
             var slicedTable = table.slice(0, 3);
             slicedTable.forEach(function(el) {
                 pushedTr += '' + el + ''
             });
         }
         newTr.innerHTML = pushedTr;
         var shortTable = table.slice(3, table.length);
         if (shortTable.length >= 3) {
             creatingNewTr(shortTable);
         } else {
             return;
         }
     }
     creatingNewTr(table);
 }

 function deleteElements(el) {
     while (el.firstChild) {
         el.removeChild(el.firstChild);
     }
 };

 var dataPostsSliced = [];
 var dataPosts = [];

 function getPosts(data, n, p) {
     dataPosts = data;
     dataPostsSliced = dataPosts.slice(0, n);
     updatePosts(dataPostsSliced, p);
 }

 var numberOfTr = 0;

 function init(n, p) {
     numberOfTr = n;
     var request = new XMLHttpRequest();
     request.open('GET', 'https://jsonplaceholder.typicode.com/comments', true);
     request.onload = function() {
         if (this.status >= 200 && this.status < 400) {
             var data = JSON.parse(this.response);
             getPosts(data, n, p);
         }
     };
     request.send();
 }


 document.addEventListener("DOMContentLoaded", function(event) {

     //============ choosing amount of data ====================

     var form = document.querySelector('.set-of-tasks form');

     function onChange(e) {
         var pos = e.path[3].getAttribute('data-n');
         document.querySelector('.table' + pos).classList.add('show-table');
         document.querySelector('.pagination' + pos).classList.add('show-table');
         var activeRadioBtn = document.querySelector('input[name=set' + pos + ']:checked').value;
         if (activeRadioBtn == 'Big') {
             init(10, pos);
             createPagBtn(10, pos);
         } else if (activeRadioBtn == 'Small') {
             init(3, pos);
             createPagBtn(3, pos);
         } else {
             var amount = prompt('Choose your amount of data, but not more than 50');
             if (amount > 50) {
                 alert('You choose more than 50');
             } else if (isNaN(amount)) {
                 alert('Please type a number');
             } else {
                 init(amount, pos);
                 createPagBtn(amount, pos);
             }
         }

     }
     form.addEventListener('change', onChange);
     //============ showing info about post ======================
     function showInfo(e) {
         var pos = e.path[3].getAttribute('data-n');
         var p = document.querySelector('.info' + pos + ' p');
         p.innerHTML = 'Choosed: ' + e.path[1].innerText + '';

     }
     document.querySelector('.table0').addEventListener('click', showInfo);
     //============ Add another block ===========================
     var n = 1;

     function onClickAddBtn() {
         var block = document.querySelector('.block');
         var newBlock = block.cloneNode(true);
         block.parentNode.appendChild(newBlock);

         function giveClass(name) {
             newBlock.querySelector('.' + name + '0').classList = (name + n);
         }

         function addEvent(whr, wht, whch) {
             newBlock.querySelector(whr).addEventListener(wht, whch);
         }

         function duplicator() {
             giveClass('table');
             giveClass('info');
             giveClass('search');
             giveClass('pagination');
             newBlock.querySelector('.pagination' + n).classList.add('pagStyle');
             newBlock.querySelector('.table' + n).classList.add('table');
             newBlock.querySelector('.set-of-tasks ').setAttribute('data-n', n);
             newBlock.querySelector('table ').setAttribute('data-n', n);

             var inputs = newBlock.querySelectorAll('.set-of-tasks form input');
             inputs.forEach(function(inp) {
                 inp.name = 'set' + n;
             });
             addEvent('.set-of-tasks form', 'change', onChange);
             addEvent('.button-add ', 'click', onClickAddBtn);
             //------ add empty table--
             var getTr = document.querySelectorAll('.table' + n + ' table tbody');
             deleteElements(getTr[0]);
             // ------- showing info--------------
             addEvent('.table' + n, 'click', showInfo);
             //------- add sorting function -------
             newBlock.querySelector('.sort-btn0').classList = ('sort-btn' + n);
             addEvent('.table' + n + ' tr:first-child', 'click', onSorting);
             //------- add search function-------
             addEvent('.search' + n, 'keyup', onSearch);
             //------- add pagination -----------
             addEvent('.pag-prev', 'click', pagControls);
             addEvent('.pag-next', 'click', pagControls);
             addEvent('.pagination' + n + ' span ', 'click', newDataTable);
             n++;
         }
         duplicator();

     }
     document.querySelector('.button-add').addEventListener('click', onClickAddBtn);

     //============ Sorting ======================================
     function onSorting(e) {
         var pos = e.path[3].getAttribute('data-n');
         var arrayOfTr = e.path[4].childNodes[1].childNodes[3].childNodes;

         var toRender = [];
         arrayOfTr.forEach(function(tr) {
             toRender.push(tr);
         });

         var getTr = document.querySelectorAll('.table' + pos + ' table tbody');
         deleteElements(getTr[0]);

         var tbody = document.querySelector('.table' + pos + ' tbody');

         var sortBtn = document.querySelector('.sort-btn' + pos);
         sortBtn.style.display = 'inline-block';

         if (sortBtn.innerHTML == 'A-Z') {
             sortBtn.innerHTML = 'Z-A';

             var sortFuncZA = toRender.sort(function(a, b) {
                 if (a.innerHTML < b.innerHTML) return 1;
             });
             sortFuncZA.forEach(function(tr) {
                 tbody.appendChild(tr);
             });

         } else {
             sortBtn.innerHTML = 'A-Z';

             var sortFuncAZ = toRender.sort(function(a, b) {
                 if (a.innerHTML > b.innerHTML) return 1;
             });
             sortFuncAZ.forEach(function(tr) {
                 tbody.appendChild(tr);
             });
         }

     }
     document.querySelector('.table0 tr:first-child').addEventListener('click', onSorting);

     //================== Search =======================
     var searchResult = dataPosts;

     function onSearch(e) {
         var pos = e.path[3].children[1].getAttribute('data-n');
         var searchString = dataPosts;

         var searchQuery = document.querySelector('.search' + pos).value.toLowerCase().trim();
         searchResult = searchString.filter(function(el) {
             var text = el.name + ' ' + el.email + ' ' + el.body;
             return text.indexOf(searchQuery) !== -1;
         });

         if (searchQuery == '') {
             console.log(pos, 'pos');
             init(numberOfTr, pos);
             createPagBtn(numberOfTr, pos);
         } else {
             var postsSliced = searchResult.slice(0, numberOfTr);
             updatePosts(postsSliced, pos);
             createPagBtn(numberOfTr, pos);
         };


     }
     document.querySelector('.search0').addEventListener('keyup', onSearch);

     //=================== Pagination ===================
     function createPagBtn(currEl, pos) {
         var paginationN = document.querySelector('.pagination'+pos);
         var nextBtn = paginationN.querySelector('.pag-next');
         var prevBtn = paginationN.querySelector('.pag-prev');
         nextBtn.classList.remove('disabledBtns');
         prevBtn.classList.add('disabledBtns');

         var totalEl = searchResult.length == 0 ? 500 : searchResult.length;
         var currentEl = currEl;
         var numOfPagBtn = Math.round(totalEl / currentEl);
         var pagCont = document.querySelector('.pagination' + pos + ' span');

         //------clearing old pagination buttons------------------
         deleteElements(pagCont);
         //---------generating new pagination buttons---------
         for (var i = 1; i <= numOfPagBtn; i++) {
             var newPagBtn = document.createElement('a');
             newPagBtn.setAttribute('data-idp', i);
             newPagBtn.innerHTML = i;
             pagCont.appendChild(newPagBtn);
         }
         updatePagBtn(pos);
     }

     //----------- showing new Data table-----
     function newDataTable(e) {
         //--------- add some active styles-------
         var pos = e.path[3].children[1].getAttribute('data-n');
         var removeActive = document.querySelectorAll('.pagination' + pos + ' span a');
         removeActive.forEach(function(a) {
             a.classList.remove('active-btn');
         });
         if (!e.target.classList.contains('active-btn')) {
             e.target.classList.add('active-btn');
         }

         var allData = searchResult.length == 0 ? dataPosts : searchResult;

         var multiplier = e.target.getAttribute('data-idp');
         var numberOfRows = numberOfTr;

         var lastIndex = multiplier * numberOfRows;
         var firstIndex = lastIndex - numberOfRows;
         var activeDataTable = allData.slice(firstIndex, lastIndex);
         updatePosts(activeDataTable, pos)

     }
     document.querySelector('.pagination0 span ').addEventListener('click', newDataTable);

     var allBtns = [];

     function updatePagBtn(pos) {
         allBtns = document.querySelectorAll('.pagination' + pos + ' span a');
         var currentBtnsArray = [];
         allBtns.forEach(function(btn) {
             currentBtnsArray.push(btn)
         });
         var slicedBtns = currentBtnsArray.slice(0, 5);
         renderPagBtn(slicedBtns, pos);
     }

     function renderPagBtn(slicedBtns, pos) {
         var getPagBtn = document.querySelector('.pagination' + pos + ' span');
         deleteElements(getPagBtn);

         //----- rendering new pagination buttons -----
         slicedBtns.forEach(function(btn) {
             getPagBtn.appendChild(btn);
         });
     }

     function pagControls(e) {
         var pos = e.path[2].children[1].getAttribute('data-n');
         var pagination = document.querySelector('.pagination' + pos);
         var prevBtn = pagination.querySelector('.pag-prev');
         var nextBtn = pagination.querySelector('.pag-next');

         //------- disables pagination controls buttons----
         if (e.target == nextBtn) {
             var firstIndexNext = document.querySelector('.pagination' + pos + ' span').lastChild.getAttribute('data-idp');
             var lastIndexNext = Number(firstIndexNext) + 5;
             prevBtn.classList.remove('disabledBtns');
             if (lastIndexNext >= allBtns.length) {
                 nextBtn.classList.add('disabledBtns');
                 prevBtn.classList.remove('disabledBtns');
             };
         } else {
             var lastIndexNext = Number(document.querySelector('.pagination' + pos + ' span').firstChild.getAttribute('data-idp')) - 1;
             var firstIndexNext = lastIndexNext - 5;
             nextBtn.classList.remove('disabledBtns');

             if (firstIndexNext == 0) {
                 prevBtn.classList.add('disabledBtns');
                 nextBtn.classList.remove('disabledBtns');
             };
         }

         var allBtnsArray = [];
         //------- show correct pag buttons after clicking controls---------
         allBtns.forEach(function(btn) {
             allBtnsArray.push(btn)
         });
         var slicedBtns = allBtnsArray.slice(firstIndexNext, lastIndexNext);
         renderPagBtn(slicedBtns, pos);

     }
     document.querySelector('.pag-prev').addEventListener('click', pagControls);
     document.querySelector('.pag-next').addEventListener('click', pagControls);

 });
