var openInEdge = {
    useDomainList: false,
    domainList: [],
    
    isLink: function (element) {
        if (element.tagName === 'A')
            return true;
        else
            if (element.parentNode)
                return openInEdge.isLink(element.parentNode)
            else
                return false;
    },
    getHref: function(element) {
        if (element.tagName === 'A')
            return element.href;
        else
            if (element.parentNode)
                return openInEdge.getHref(element.parentNode);
            else
                return undefined;
    },
    isRightClick: function (e) {
        var rightClick;
        if (e.which) 
            rightClick = (e.which == 3);
        else if (e.button)
            rightClick = (e.button == 2);

        return rightClick;
    },
    handleWindowClick: function (event) {
        var element = event.target || event.srcElement;
        var targetIsLink = openInEdge.isLink(element);
        if (targetIsLink && openInEdge.isRightClick(event) == false) {
            if (openInEdge.useDomainList == true) {
                var href = openInEdge.getHref(element);
                console.debug('Handling left click: ' + href);
    
                for (var i = 0; i < openInEdge.domainList.length; i++) {
                    var regex = new RegExp(openInEdge.domainList[i], "gi");
    
                    if (regex.test(href)) {
                        console.debug('Href matches pattern');
                        self.port.emit("edgeLinkClicked", href);
                        event.preventDefault();
                        event.returnValue = false;
                        return false;
                    }
                }
            }
        }
    }
};

self.port.on("setPreferences", function(prefs) {
    openInEdge.useDomainList = prefs['useDomainList'];
    
    var domains = prefs['domainList'].split('|');
    for (var i=0; i<domains.length; i++) {
        console.debug('\tDomain found: ' + domains[i]);
        openInEdge.domainList.push(domains[i]);
    } 
});
window.addEventListener("click", openInEdge.handleWindowClick, false);
