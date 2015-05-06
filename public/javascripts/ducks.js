
$(function () {
    if (window.location.pathname.indexOf('search') != -1) {
        $("body").css('background-color', '#fff');
    }
    
    ducks.page.getWordList();
    $('#search-btn').on('click', ducks.page.search);
});

var ducks = {
    page: {}
};

ducks.page.getWordList = function () {
    var url = "/words";
    var settings = {
        type: 'GET',
        success: function (data, status, xhr) {
            console.log(data);
            ducks.page.words = JSON.parse(data);
            $('#the-basics .typeahead').typeahead({
                hint: true,
                highlight: true,
                minLength: 1
            },
            {
                name: 'words',
                source: ducks.page.substringMatcher(ducks.page.words)
            });
        },
        error: function (jqXHR, status, error) {
            console.log(error);
        }
    };

    $.ajax(url, settings);
}

//ducks.page.search = function () {
//    var myWord = $("#word-search").val();
//    var url = "/search/" + myWord;
//    var settings = {
//        type: 'GET',
//        success: function (data, status, xhr) {
//            console.log(data);
//            if (data != null && data != "") {
//                ducks.page.myWordData = JSON.parse(data);
//            }
//        },
//        error: function (jqXHR, status, error) {
//            console.log(error);
//        }
//    };
    
//    $.ajax(url, settings);
//}

ducks.page.search = function () {
    var myWord = $("#word-search").val();
    var url = "/search/" + myWord;
    window.location = url;
}

ducks.page.substringMatcher = function (strs) {
    return function findMatches(q, cb) {
        var matches, substringRegex;
        
        // an array that will be populated with substring matches
        matches = [];
        
        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');
        
        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function (i, str) {
            if (substrRegex.test(str)) {
                matches.push(str);
            }
        });
        
        cb(matches);
    };
};

