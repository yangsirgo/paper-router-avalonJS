/**
 * Created by Xcar on 2017/2/6.
 */
function getPages(currentPage) {
    var pages = []
    var s = this.showPages
    var total = this.totalPages
    var half = Math.floor(s / 2)
    var start = currentPage - half + 1 - s % 2
    var end = currentPage + half

    // handle boundary case
    if (start <= 0) {
        start = 1;
        end = s > total ? total : s;
    }
    if (end > total) {
        start = total - s + 1
        end = total
    }

    var itPage = start;
    while (itPage <= end) {
        pages.push(itPage)
        itPage++
    }

    return {currentPage: currentPage, pages: pages};
}

function getHashStr(name) {
    var url = location.hash; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?")) {
        var str = url.substr(url.indexOf("?") + 1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest[name];
}
avalon.component('ms-pager',{
    template:avalon.heredoc(function(){
        /*
         <div class="btom_page"  ms-visible='@totalPages>1'>
         <a ms-class='{disabled: @isDisabled("first", 1)}'  ms-attr='{title:@getTitle("first")}'
         ms-click='@cbProxy($event,"first",@searchVale)'
         class="icon-double-angle-left"
         >{{@firstText}}
         </a>
         <a ms-attr='{title:@getTitle("prev")}'  ms-class='[( @isDisabled("prev",1)? "am-disabled":"btom_page_active")]'
         ms-click='@cbProxy($event,"prev",@searchVale)'
         class="page_left"
         >{{@prevText}}
         </a>
         <span>
         <a  ms-for='page in @pages' ms-class='{pageber_active: page === @currentPage}'  ms-attr='{title:@getTitle(page)}'
         ms-click='@cbProxy($event,page,@searchVale)'
         >
         {{page}}
         </a>
         </span>
         <a ms-class='[(@isDisabled("next",@totalPages)? "am-disabled":"btom_page_active")]'  ms-attr='{title: @getTitle("next")}'
         ms-click='@cbProxy($event,"next",@searchVale)'
         class="page_right"
         >{{@nextText}}
         </a>
         <a  ms-attr='{title: @getTitle("last")}'
         ms-click='@cbProxy($event,"last",@searchVale)'
         class="icon-double-angle-right" class="page_right"
         >{{@lastText}}
         </a>
         </div>
         */
    }),
    defaults:{
        $id        : 'ms-pager',
        is_ie      : false,
        is_more    : true,
        hash       : '',
        searchVale:'',
        getHref    : function (a,val) {
            if (this.is_more) {
                if (location.hash) {
                    var search = location.hash,
                        page   = getHashStr('page');
                        searchVal = getHashStr('searchValue');
                    if (page||searchVal) { // 存在就替换
                        search = search.replace('page=' + page, 'page=' + this.toPage(a));
                        search = search.replace('searchValue=' + encodeURI(searchVal), 'searchValue=' + encodeURI(val));
                        return search;
                    }
                    else { // 不存在就叠加
                        return location.hash + '?page=' + this.toPage(a)+"&searchValue="+encodeURI(val)
                    }
                }
                else {
                    return '#?page=' + this.toPage(a)+"&searchValue="+encodeURI(val)
                }
            }
            else {
                return '#page-' + this.toPage(a)+"&searchValue="+encodeURI(val)
            }
        },
        getTitle   : function (title) {
            return title
        },
        isDisabled : function (name, page) {
            return this.$buttons[name] = (this.currentPage === page)
        },
        $buttons   : {},
        showPages  : 5,
        pages      : [],
        totalPages : 100,
        currentPage: 1,
        firstText  : '首页',
        prevText   : '上一页',
        nextText   : '下一页',
        lastText   : '最后一页',
        onPageClick: avalon.noop,
        toPage     : function (p) {
            var cur = this.currentPage
            var max = this.totalPages
            switch (p) {
                case 'first':
                    return 1
                case 'prev':
                    return Math.max(cur - 1, 1)/*从第一页开始*/
                case 'next':
                    return Math.min(cur + 1, max)
                case 'last':
                    return max
                default:
                    return p
            }
        },
        cbProxy    : function (e, p,val) {
            var cur = this.toPage(p);
            //if (this.$buttons[p] || p === this.currentPage) {
            //    if (cur === 1) {
            //        return this.onPageClick(e, cur);
            //    }
            //    // e.preventDefault()
            //    // 兼容IE8
            //    if(document.all){ //判断IE浏览器
            //        window.event.returnValue = false;
            //    }
            //    else{
            //        event.preventDefault();
            //    };
            //    return //disabled, active不会触发
            //}
            /*替换链接改变hash的形式*/
            window.location.hash = this.getHref(p,val);
            this.render(cur);
            return this.onPageClick(e, cur,val);
        },
        render     : function (cur) {/*更新页码*/
            var obj = getPages.call(this, cur);
            this.currentPage = obj.currentPage;
            this.pages = obj.pages;
        },
        /*此处供正常单页应用*/
        rpage      : function () {
            return this.is_more ? /(?:#|\?)page\=(\d+)/ : /(?:#|\?)page\-(\d+)/;
        },
        cur        : function () { /*正确获取匹配页码*/
            var cur = this.currentPage;
            var match = this.rpage && location.href.match(this.rpage());
            if (match && match[1]) {
                var cur = ~~match[1]
                if (cur < 0 || cur > this.totalPages) {
                    cur = 1
                }
            }
            return cur;
        },
        curval:function(){
            var curval = this.searchVale;
            var match = location.href.match(/(^|\?|&)searchValue=(.*)/);
            if (match && match[2]) {
                var curval = decodeURI(match[2])
                if(this.searchVale!=curval){
                    console.log(curval);
                    this.changeHandler(curval);
                }
            }
            return curval;
        },
        changeHandler:avalon.loop,
        onInit     : function () {
            var that = this;
            /**复杂单页应用，切换选项卡，重置页码
             * 但切换选项卡或者数据页数变化时，重置页码
             * */
            this.$watch('totalPages', function () {
                that.render(that.cur())
            });
            this.$watch('currentPage', function () {
                that.render(that.cur());
            });
            if (!that.is_ie && !that.is_more) {
                /**
                 * 完美支持单页一分页组件（仅支持现代浏览器）
                 * 浏览器回退键功能启动
                 * */
                avalon.bind(window,"hashchange",function () {
                    that.cbProxy(window.event, that.cur());
                })
                // window.addEventListener("hashchange", function () {
                //     that.cbProxy(window.event, that.cur());
                // }, false);
            }
            else if (!that.is_ie && that.is_more) {
                /**
                 * 支持单页多分页组件（仅支持现代浏览器）
                 * 此功能适用于单页多分页情景，开启此功能，可配合路由。
                 * 监听location.hash触发特定的onPageClick
                 * */
                avalon.bind(window,"hashchange",function () {
                    //that.render(that.cur());
                    that.cbProxy(window.event, that.cur(),that.curval());
                })
                // window.addEventListener("hashchange", function () {
                //     that.render(that.cur());
                // }, false);
            }
            /*进入页面预载入页码*/
            that.render(that.cur());
        }
    }
})
