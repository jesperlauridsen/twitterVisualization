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
                        likes:Number(singleTweetArray[5]),
                        retweets:Number(singleTweetArray[6]),
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

function generateSetup() {
    var intro = document.createElement('div');
    intro.id = "intro";
    var length = ((window.innerWidth/4)*1)-30;
    intro.style.width  = length + "px";
    intro.style.height = "300px";
    intro.style.float = "left";
    document.body.appendChild(intro);
    //canvas.style.border = "1px solid";

    var identifier = document.createElement('div');
    identifier.id = "identifier";
    var length = ((window.innerWidth/4)*1)-30;
    identifier.style.width  = length + "px";
    identifier.style.height = "300px";
    identifier.style.float = "right";
    document.body.appendChild(identifier);

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.id = "canvas";
    canvas.width  = (window.innerWidth/4)*2-30;
    canvas.height = 300;
    canvas.style.zIndex = 8;
    canvas.style.float = "right";
    canvas.style.border = "1px solid";
    document.body.appendChild(canvas);
    var seperateNumber;
    var arrayOfDividers = [];
    for(y=1;y<=24;y++) {
        seperateNumber = canvas.width/25 * y;
        arrayOfDividers.push(seperateNumber);
    }
    console.log(arrayOfDividers);
    ctx.beginPath();
    ctx.moveTo(5,5);
    ctx.lineTo(5,280);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5,280);
    ctx.lineTo(canvas.width-5,280);
    ctx.stroke()
    for(i=0;i<arrayOfDividers.length;i++) {
        ctx.beginPath();
        ctx.moveTo(arrayOfDividers[i],275);
        ctx.lineTo(arrayOfDividers[i],285);
        ctx.stroke();
        //ctx.font = "30px Arial";
        var textNumber = "";
        if(i < 10) {
            textNumber = Number(i) + Number(1);
            textNumber = "0" + i;
        }
        else {
            textNumber = i + 1;
        }
        ctx.fillText(textNumber,arrayOfDividers[i]-5,295);
    }
}

function plotData() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var days = [];
    for(i=0;i<globalData;i++) {
        for(u=0;u<days.length;u++) {
            else {

            }
        }
    }

}

function introductonToStatistics() {
    if(dataInjected === 0) {
       showTwitterData();
    }
    generateSetup();
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
    console.log("number of tweets: " + tweets);

    var likes = 0;
    for(o=0;o<globalData.length;o++) {
        likes = likes + globalData[o].likes;
    }
    console.log("number of likes overall: " + likes);
    var retweets = 0;
    for(n=0;n<globalData.length;n++) {
        retweets = retweets + globalData[n].retweets;
    }
    console.log("Number of retweets " + retweets);
    console.log("Number of authors " + " " + authors.length);
    var text = "<h3>Breakdown of #DST4L</h3><p>This dataset contains tweets from <strong>" + diffDays + "</strong> days, the " + startDate.getDate() + "/" + startDate.getMonth() + "-" + startDate.getFullYear() + " to " + endDate.getDate() + "/" + endDate.getMonth() + "-" + endDate.getFullYear() + ", which was <strong>" + tweets + "</strong> tweets written by <strong>" + authors.length + "</strong> authors using the hashtag #DST4L. This means <strong>" + tweets/diffDays + "</strong> tweets per day. There was a total of <strong>" + likes + "</strong> likes on these tweets, giving an average of <strong>" + (likes/tweets).toFixed(2) + "</strong> likes per tweet. There was <strong>" + retweets + "</strong> retweets on these tweets, giving an average of <strong>" + (retweets/tweets).toFixed(2) + "</strong> retweets per tweet.</p>";
    document.getElementById("intro").innerHTML = text;
}

function showDayProgress() {
    generateCanvas();
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
