/**
 * Adds a Load More button at the bottom of the list. When the user presses this button,
 * the next page of data will be loaded into the store and appended to the List.
 */
Ext.define('Ext.plugins.PagingPlugin', {
    requires: 'Ext.PluginManager',
    extend: 'Ext.util.Observable',
    alternateClassName: 'Ext.plugins.PagingPlugin',

    /**
     * @cfg {Boolean} autoPaging True to automatically load the next page when you scroll to the bottom of the list.
     * Defaults to false.
     */
    autoPaging: false,

    /**
     * @cfg {String} loadMoreText The text used as the label of the Load More button.
     */
    loadMoreText: 'Load More...',

    init: function(list) {console.log(list)
        this.list = list;

        list.onBeforeLoad = Ext.util.Functions.createInterceptor(list.onBeforeLoad, this.onBeforeLoad, this);

        // Update the paging button location if its enabled
        this.mon(list, 'update', this.onListUpdate, this);
    },

    onListUpdate: function() {
        this.el.appendTo(this.list.getTargetEl());
        if (!this.autoPaging) {
            this.el.removeCls(Ext.baseCSSPrefix + 'loading');
        }
        this.loading = false;
    },

    render: function() {
        var list = this.list,
            targetEl = list.getTargetEl(),
            html = '';

        if (!this.autoPaging) {
            html += '<div class="' + Ext.baseCSSPrefix + 'list-paging-msg">' + this.loadMoreText + '</div>';
        }

        this.el = targetEl.createChild({
            cls: Ext.baseCSSPrefix + 'list-paging' + (this.autoPaging ? ' ' + Ext.baseCSSPrefix + 'loading' : ''),
            html: html + Ext.LoadingSpinner
        });

        if (this.autoPaging) {
            this.mon(targetEl.getScrollParent(), 'scrollend', this.onScrollEnd, this);
        }
        else {
            this.mon(this.el, 'tap', this.onPagingTap, this);
        }

        this.rendered = true;
    },

    onBeforeLoad: function() {
        if (this.loading && this.list.store.getCount() > 0) {
            this.list.loadMask.disable();
            return false;
        }
    },

    /**
     * Here we listen for taps on the loadingEl and load the store's next page. Adding the 'x-loading' class to the
     * loadingEl hides the 'Load next page' text.
     */
    onPagingTap: function(e) {
        if (!this.loading) {
            this.loading = true;
            this.list.store.nextPage();
            this.el.addCls(Ext.baseCSSPrefix + 'loading');
        }
    },

    onScrollEnd: function(scroller, pos) {
        if (pos.y >= Math.abs(scroller.offsetBoundary.top)) {
            this.loading = true;
            this.list.store.nextPage();
        }
    }
}, function(){

    Ext.preg('listpaging', Ext.plugins.PagingPlugin);

});
