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
                showEntireEventTweetProgress(globalData);
                //plotDataForAllDaysIn24HourInterval(globalData);
            }
        }
    }
    rawFile.send(null);
}
//Show tweets over time from the period
function showTweetsOverTime() {

}

function generateSetup() {
    var intro = document.createElement('div');
    intro.id = "intro";
    var length = ((window.innerWidth/4)*1)-30;
    intro.style.width  = length + "px";
    intro.style.height = "350px";
    intro.style.float = "left";
    document.body.appendChild(intro);
    //canvas.style.border = "1px solid";

    var identifier = document.createElement('div');
    identifier.id = "canvasContainer";
    var length = ((window.innerWidth/4)*3)-30;
    identifier.style.width  = length + "px";
    identifier.style.height = "350px";
    identifier.style.float = "right";
    document.body.appendChild(identifier);

    var canvasHeadline = document.createElement('h3');
    canvasHeadline.id = "canvasHeadline";
    var length2 = ((window.innerWidth/4)*3)-30;
    canvasHeadline.style.width  = length2 + "px";
    identifier.style.height = "50px";
    document.getElementById("canvasContainer").appendChild(canvasHeadline);

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.id = "canvas";
    canvas.width = ((window.innerWidth/4)*3)-30;
    canvas.height = 300;
    canvas.style.zIndex = 8;
    canvas.style.border = "1px solid";
    document.getElementById("canvasContainer").appendChild(canvas);
}

function plotDataForAllDaysIn24HourInterval(dataset) {
    document.getElementById("canvasHeadline").innerHTML = "All tweets in the period in a 24 hour grid";
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var seperateNumber;
    var arrayOfDividers = [];
    for(y=1;y<=24;y++) {
        seperateNumber = document.getElementById("canvas").width/25 * y;
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
    //10 pre-set colors. Enough for now, yes?
    var presetColors= ["rgba(255, 0, 255, 0.5)","rgba(0, 0, 255, 0.5)","rgba(0, 255, 255, 0.5)","rgba(0, 128, 128, 0.5)","rgba(0, 255, 0, 0.5)","rgba(255, 255, 0, 0.5)","rgba(255, 0, 0, 0.5)","rgba(192, 192, 192, 0.5)","rgba(0, 0, 0, 0.5)","rgba(255,69,0, 0.5)"];
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var days = [];
    var hours = [];
    var existing = 0;
    //console.log("yay" + globalData);
    for(n=0;n<dataset.length;n++) {
        existing = 0;
        for(y=0;y<days.length;y++) {
            if(dataset[n].realtime.getDate() === days[y][0].realtime.getDate() && dataset[n].realtime.getMonth() === days[y][0].realtime.getMonth() && dataset[n].realtime.getFullYear() === days[y][0].realtime.getFullYear()) {
                existing = 1;
                days[y].push(dataset[n])
            }
        }
        if(existing === 0) {
            days[days.length] = new Array();
            days[days.length-1].push(dataset[n]);
        }
    }
    //console.log(days);
    for(u=0;u<days.length;u++) {
        hours[hours.length] = new Array();
        for(h=0;h<24;h++) {
        var value = 0;
        hours[hours.length-1].push(value);
    }
        for(i=0;i<days[u].length;i++) {
            var newValue = hours[hours.length-1][days[u][i].realtime.getHours()] + 1;
            hours[hours.length-1][days[u][i].realtime.getHours()] = newValue;
            //console.log(days[u][i].realtime.getHours());
            }
        }

    var highestHour = 0;
    for(n=0;n<hours.length;n++) {
        for(k=0;k<hours[n].length;k++) {
            if(hours[n][k] >= highestHour) {
                highestHour = hours[n][k];
            }
        }
    }

    hours.reverse();
    days.reverse();
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(5,5);
    ctx.lineTo(10,5)
    ctx.stroke();
    ctx.fillText(highestHour,10,9)

    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(5,137.5);
    ctx.lineTo(10,137.5);
    ctx.stroke();
    ctx.fillText(Math.floor(highestHour/2),10,141.5)

    for(o=0;o<days.length;o++) {
        //console.log(days[o][0].realtime.getDate());
        //ctx.fillText(days[o][0].realtime.getDate() + "/" + days[o][0].realtime.getMonth() + "-" +days[o][0].realtime.getFullYear(),canvas.width-150,10 +(o*10));
    }

    var arrayOfDividers = [];
    for(y=1;y<=24;y++) {
        seperateNumber = canvas.width/25 * y;
        arrayOfDividers.push(seperateNumber);
    }
    for(n=0;n<hours.length;n++) {
        ctx.fillStyle = presetColors[n];
        ctx.font = "16px Arial";
        ctx.fillText(days[n][0].realtime.getDate() + "/" + days[n][0].realtime.getMonth() + "-" +days[n][0].realtime.getFullYear() + " (" + days[n].length + " tweets)" ,canvas.width-185,20 +(n*20));
        for(k=0;k<hours[n].length;k++) {
            var heightZ;
            if(hours[n][k] === 0) {
                heightZ = 280;
            }
            else {
                heightZ = 280 - ((hours[n][k] / highestHour) * 275);
            }
            var hour = k + 1;
            //console.log("day: " + n + " hour: " + hour + " number of tweets: " + hours[n][k] + " height: " + heightZ);
            ctx.strokeStyle = presetColors[n];
            ctx.fillStyle = presetColors[n];
            ctx.beginPath();
            //console.log(arrayOfDividers[k] + " " + heightZ + " " + hours[n][k]);
            ctx.arc(arrayOfDividers[k],heightZ,2,0,2*Math.PI);
            ctx.stroke();
            ctx.closePath();
            ctx.fill();
            //console.log("painting?");
        }
    }
    for(n=0;n<hours.length;n++) {
        for(k=0;k<hours[n].length;k++) {
            var HZ;
            var HX;
            if(hours[n][k] === 0) {
                HZ = 280;
            }
            else {
                HZ = 280 - ((hours[n][k] / highestHour) * 275);
            }
            if(hours[n][k+1] === 0) {
                HX = 280;
            }
            else {
                HX = 280 - ((hours[n][k+1] / highestHour) * 275);
            }
            ctx.strokeStyle = presetColors[n];
            ctx.beginPath();
            ctx.moveTo(arrayOfDividers[k],HZ);
            ctx.lineTo(arrayOfDividers[k+1],HX);
            ctx.stroke();
        }
    }
    console.log(days);
}

function showEntireEventTweetProgress(dataset) {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var endDate = globalData[0].realtime;
    var startDate = globalData[globalData.length-1].realtime;
    var oneDay = 24*60*60*1000;
    var diffDays = Math.ceil(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
    console.log(diffDays);
    var difference = canvas.width/diffDays;
    for(y=1;y<diffDays;y++) {
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        console.log()
        ctx.moveTo(Math.floor(y*difference),280);
        ctx.lineTo(Math.floor(y*difference),290);
        ctx.stroke();
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
    var text = "<h3>Breakdown of #DST4L</h3><p>This dataset contains tweets from <strong>" + diffDays + "</strong> days, the " + startDate.getDate() + "/" + startDate.getMonth() + "-" + startDate.getFullYear() + " to " + endDate.getDate() + "/" + endDate.getMonth() + "-" + endDate.getFullYear() + ", which was <strong>" + tweets + "</strong> tweets written by <strong>" + authors.length + "</strong> authors using the hashtag #DST4L. This means an average of <strong>" + tweets/diffDays + "</strong> tweets per day. There was a total of <strong>" + likes + "</strong> likes on these tweets, giving an average of <strong>" + (likes/tweets).toFixed(2) + "</strong> likes per tweet. There was <strong>" + retweets + "</strong> retweets on these tweets, giving an average of <strong>" + (retweets/tweets).toFixed(2) + "</strong> retweets per tweet.</p>";
    document.getElementById("intro").innerHTML += text;
}


//Show Number of tweets, number of likes all over, number of tweeters, mosts tweets in what hour, etc.
function showOverallStatistics(dataset) {
}
//List of contributers / procentage of tweets from every single contributor.
function showAllContributors(dataset) {
    //var canvas = document.getElementById("canvas");
    //var ctx = canvas.getContext("2d");
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    var contributors = [];
    var alreadyPresent = 0;
    for(i=0;i<dataset.length;i++) {
        alreadyPresent = 0;
        for(u=0;u<contributors.length;u++) {
            if(contributors[u].handle === dataset[i].handle) {
                alreadyPresent = 1;
                contributors[u].tweetsByTweeter = contributors[u].tweetsByTweeter + 1;
            }
        }
        if(alreadyPresent === 0) {
            var tweeterObject = {
                handle:dataset[i].handle,
                tweetsByTweeter:1,
                name:dataset[i].tweeter,
            }
            contributors.push(tweeterObject);
            contributors[contributors.length-1].tweetsByTweeter = 1;
        }
    }
    contributors.sort(function(a, b) {return parseFloat(a.tweetsByTweeter) - parseFloat(b.tweetsByTweeter);});
    contributors.reverse();
    console.log(contributors);
}

//List of most retweeted / procentage of retweets from the entire retweeters.
function showMostRetweeted(dataset) {
    dataset.sort(function(a, b) {return parseFloat(a.retweets) - parseFloat(b.retweets);});
    dataset.reverse();
    console.log(dataset)
}
//List of most liked / procentage of all likes on the hashtag in that time interval.
function showMostLiked(dataset) {
    dataset.sort(function(a, b) {return parseFloat(a.likes) - parseFloat(b.likes);});
    dataset.reverse();
    console.log(dataset)
}

function PersonWithMostRetweets(dataset) {
    var retweeters = [];
    var alreadyPresent = 0;
    for(i=0;i<dataset.length;i++) {
        alreadyPresent = 0;
        for(u=0;u<retweeters.length;u++) {
            if(retweeters[u].handle === dataset[i].handle) {
                alreadyPresent = 1;
                retweeters[u].allRetweets = retweeters[u].allRetweets + dataset[i].retweets;
                retweeters[u].numberOfTweets = retweeters[u].numberOfTweets + 1;
            }
        }
        if(alreadyPresent === 0) {
            var tweeterObject = {
                handle:dataset[i].handle,
                allRetweets:dataset[i].retweets,
                name:dataset[i].tweeter,
                numberOfTweets:1,
            }
            retweeters.push(tweeterObject);
        }
    }
    retweeters.sort(function(a, b) {return parseFloat(a.allRetweets) - parseFloat(b.allRetweets);});
    retweeters.reverse();
    for(k=0;k<retweeters.length;k++) {
        retweeters[k].retweetRatio = Math.round(retweeters[k].allRetweets/retweeters[k].numberOfTweets *100) / 100;
    }
    console.log(retweeters);
}

function personWithMostLikes(dataset) {
    var likes = [];
    var alreadyPresent = 0;
    for(i=0;i<dataset.length;i++) {
        alreadyPresent = 0;
        for(u=0;u<likes.length;u++) {
            if(likes[u].handle === dataset[i].handle) {
                alreadyPresent = 1;
                likes[u].allLikes = likes[u].allLikes + dataset[i].likes;
                likes[u].numberOfTweets = likes[u].numberOfTweets + 1;
            }
        }
        if(alreadyPresent === 0) {
            var tweeterObject = {
                handle:dataset[i].handle,
                allLikes:dataset[i].likes,
                name:dataset[i].tweeter,
                numberOfTweets:1,
            }
            likes.push(tweeterObject);
        }
    }
    likes.sort(function(a, b) {return parseFloat(a.allLikes) - parseFloat(b.allLikes);});
    likes.reverse();
    for(k=0;k<likes.length;k++) {
        likes[k].retweetRatio = Math.round(likes[k].allLikes/likes[k].numberOfTweets *100) / 100;
    }
    console.log(likes);
}
