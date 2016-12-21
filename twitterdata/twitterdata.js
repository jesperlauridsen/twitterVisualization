var globalData;
var dataInjected = 0;

function showTwitterData() {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "finaltweeterdata-sorted.csv", true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                var arrayOfDataObjects = [];
                //console.log(allText);
                var lineArr = allText.split('\n');
                for(y=1;y<lineArr.length-1;y++) {
                    var singleTweetArray = lineArr[y].split(";");
                    var realTime = singleTweetArray[7] * 1000;
                    var tweetTime = new Date(realTime);
                    var object = {
                        tweeter:singleTweetArray[2],
                        link:singleTweetArray[1],
                        handle:singleTweetArray[3],
                        tweet:singleTweetArray[4],
                        datatime:singleTweetArray[7],
                        realtime:tweetTime,
                        likes:singleTweetArray[5],
                        retweets:singleTweetArray[6],
                    }
                   arrayOfDataObjects.push(object);
                }
                console.log(arrayOfDataObjects);
                globalData = arrayOfDataObjects;
                dataInjected = 1;
                introductonToStatistics();
            }
        }
    }
    rawFile.send(null);
}
//Show tweets over time from the period
function showTweetsOverTime() {
    if(dataInjected === 0) {
       showTwitterData();
    }

}

function introductonToStatistics() {
    if(dataInjected === 0) {
       showTwitterData();
    }
    console.log(globalData);
    var endDate = globalData[0].realtime;
    var startDate = globalData[globalData.length-1].realtime;
    var oneDay = 24*60*60*1000;
    var diffDays = Math.ceil(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
    console.log(startDate + " " + endDate + " number of days between: " + diffDays);
    var authors = [];
    var alreadyThere = false;
    for(u=0;u<globalData.length;u++) {
        //console.log("running");
        alreadyThere = false;
        for(i=0;i<authors.length;i++) {
            var stringA = globalData[u].handle;
            var stringB = authors[i].handle;
            //console.log("is " + stringA + " and " + stringB + " the same?");
            //console.log(stringA.localeCompare(stringB) === 0);
            if(stringA.localeCompare(stringB) === 0 && alreadyThere === false) {
                alreadyThere = true;
                authors[i].numberOfTweets = authors[i].numberOfTweets + 1;
            }
        }
        //console.log("is he already there? " + alreadyThere);
        if(alreadyThere === false) {
            var author = {
                name:globalData[u].tweeter,
                handle:globalData[u].handle,
                numberOfTweets:1,
            }
            //console.log("new author!" + globalData[u].tweeter);
            authors.push(author);
            //authors[authors.length-1].numberOfTweets = 1;
        }
        //console.log(authors);
    }
    console.log(authors);
    var tweets = 0;
    for(h=0;h<authors.length;h++) {
        tweets = tweets + authors[h].numberOfTweets;
    }
    var likes = 0;
    for(o=0;o<globalData.length;o++) {
        likes = likes + globalData[o].likes;
    }
    var retweets = 0;
    for(n=0;n<globalData.length;n++) {
        retweets = retweets + globalData[n].retweets;
    }
    console.log(tweets + " " + authors.length);
}

//Show Number of tweets, number of likes all over, number of tweeters, mosts tweets in what hour, etc.
function showOverallStatistics() {
   if(dataInjected === 0) {
       showTwitterData();
    }

}
//List of contributers / procentage of tweets from every single contributor.
function showBiggestContributors() {
    if(dataInjected === 0) {
       showTwitterData();
    }
}
//List of most retweeted / procentage of retweets from the entire retweeters.
function showMostRetweeted() {
    if(dataInjected === 0) {
       showTwitterData();
    }
}
//List of most liked / procentage of all likes on the hashtag in that time interval.
function showMostLiked() {
    if(dataInjected === 0) {
       showTwitterData();
    }
}
