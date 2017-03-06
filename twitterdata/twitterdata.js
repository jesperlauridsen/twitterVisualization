var globalData;
var dataInjected = 0;

function loadTwitterData() {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "finaltweeterdata-sorted2.csv", true);
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
                    if(y===1) {
                        console.log(object.realtime + " " + object.tweet);
                    }
                   arrayOfDataObjects.push(object);
                }
                globalData = arrayOfDataObjects;
                dataInjected = 1;
                showFirstTwitterData();
            }
        }
    }
    rawFile.send(null);
}

function showFirstTwitterData() {
    introductonToStatistics(globalData);
    creatingTweetOverview(globalData);
    showEntireEventTweetProgress(globalData);
    personWithHighestTweets(globalData,"field");
    showMostLiked(globalData,"field2");
    showMostRetweeted(globalData,"field3");
    //plotDataForAllDaysIn24HourInterval(globalData);
}

function findStartDate(dataset) {
    var startDate;
    for(n=0;n<dataset.length;n++) {
        if(n === 0) {
            startDate = dataset[n];
        }
        else {
            if(dataset[n].realtime.getTime() < startDate.realtime.getTime()) {
                startDate = dataset[n];
            }
            else {
            }
        }
    }
    //console.log(" - " + startDate.realtime);
    return startDate;
}

function findEndDate(dataset) {
    var endDate;
    for(n=0;n<dataset.length;n++) {
        if(n === 0) {
            endDate = dataset[n];
        }
        else {
            if(dataset[n].realtime.getTime() > endDate.realtime.getTime()) {
                endDate = dataset[n];
            }
            else {
            }
        }
    }
    //console.log(" - " + endDate.realtime);
    return endDate;
}

function generateSetup() {
    var introContainer = document.createElement('div');
    introContainer.id = "introContainer";
    introContainer.className = "introContainer";
    document.body.appendChild(introContainer);

    var intro = document.createElement('div');
    intro.id = "intro";
    var length = ((window.innerWidth/4)*1)-30;
    intro.style.width  = length + "px";
    intro.style.height = "350px";
    intro.style.float = "left";
    document.getElementById("introContainer").appendChild(intro);
    //canvas.style.border = "1px solid";

    var identifier = document.createElement('div');
    identifier.id = "canvasContainer";
    var length = ((window.innerWidth/4)*3)-30;
    identifier.style.width  = length + "px";
    //identifier.style.height = "350px";
    identifier.style.float = "right";
    document.getElementById("introContainer").appendChild(identifier);

    var canvasHeadline = document.createElement('h3');
    canvasHeadline.id = "canvasHeadline";
    var length2 = ((window.innerWidth/4)*3)-30;
    canvasHeadline.style.width  = length2 + "px";
    //canvasHeadline.style.height = "50px";
    document.getElementById("canvasContainer").appendChild(canvasHeadline);

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.id = "canvas";
    canvas.width = ((window.innerWidth/4)*3)-30;
    canvas.height = 300;
    canvas.style.zIndex = 8;
    //canvas.style.border = "1px solid";
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

function showEntireEventTweetProgress(dataset,person) {
    var presetColors= ["rgba(255, 0, 255, 0.5)","rgba(0, 0, 255, 0.5)","rgba(0, 255, 255, 0.5)","rgba(0, 128, 128, 0.5)","rgba(0, 255, 0, 0.5)","rgba(255, 255, 0, 0.5)","rgba(255, 0, 0, 0.5)","rgba(192, 192, 192, 0.5)","rgba(0, 0, 0, 0.5)","rgba(255,69,0, 0.5)"];
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    document.getElementById("canvasHeadline").innerHTML = "All tweets in the dataset over the entire period of time.";
    sortedDataset = globalData.sort(function(a, b) {return parseFloat(a.realtime.getTime()) - parseFloat(b.realtime.getTime());});
    console.log("---");
    var endDate = findEndDate(dataset);
    var startDate = findStartDate(dataset);
    var startDateToText = new Date();
    startDateToText.setTime(sortedDataset[0].realtime);
    console.log(sortedDataset);
    console.log(startDate);
    console.log(endDate);
    var oneDay = 24*60*60*1000;
    var diffDays = Math.ceil(Math.abs((startDate.realtime.getTime() - endDate.realtime.getTime())/(oneDay)));
    console.log(Math.abs((startDate.realtime.getTime() - endDate.realtime.getTime())/(oneDay)));
    console.log(diffDays);
    var difference = canvas.width/diffDays;
    var singlePoint = (canvas.width/diffDays)/24;
    var startSinglePoint = singlePoint/2;
    for(u=0;u<diffDays;u++) {
        for(y=1;y<24;y++) {
            ctx.beginPath();
            ctx.moveTo((singlePoint*y)+(u*difference),281);
            ctx.lineTo((singlePoint*y)+(u*difference),283);
            ctx.stroke();
            //if(y%2 == 0) {
               ctx.font="7px Trebuchet MS";
               ctx.fillStyle="white";
                if(y < 10) {
                    ctx.fillText(y,(singlePoint*y)+(u*difference)-3,290);
                }
                else {
                    ctx.fillText(y,(singlePoint*y)+(u*difference)-5,290);
                }
            //}
        }
    }
    ctx.beginPath();
    ctx.moveTo(5,5);
    ctx.lineTo(5,280);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(5,280);
    ctx.lineTo(canvas.width-5,280);
    ctx.stroke();
    ctx.font="10px Trebuchet MS";
    var monthToDisplay = startDateToText.getMonth() + 1;
    ctx.fillText(startDateToText.getDate() + "/" + monthToDisplay,0,295);
    startDateToText.setDate(startDateToText.getDate()+1);
    for(y=1;y<diffDays;y++) {
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        console.log()
        ctx.moveTo(Math.floor(y*difference),280);
        ctx.lineTo(Math.floor(y*difference),285);
        ctx.stroke();
        ctx.font="10px Trebuchet MS";
        ctx.fillText(startDateToText.getDate() + "/" + monthToDisplay,y*difference-10,295);
        startDateToText.setDate(startDateToText.getDate()+1);
        monthToDisplay = startDateToText.getMonth() + 1;
    }
    var days = [];
    var hours = [];
    var existing = 0;
    for(n=0;n<dataset.length;n++) {
        existing = 0;
        for(y=0;y<days.length;y++) {
            if(dataset[n].realtime.getDate() === days[y][0].realtime.getDate() && dataset[n].realtime.getMonth() === days[y][0].realtime.getMonth() && dataset[n].realtime.getFullYear() === days[y][0].realtime.getFullYear()) {
                existing = 1;
                days[y].push(dataset[n])
            }
        }
        if(existing === 0) {
            //console.log("NEW! " + dataset[n].realtime + " " + dataset[n].tweet + " " + dataset[n].datatime);
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
    var totalNumberOfEntries = 0;
    for(n=0;n<hours.length;n++) {
        for(k=0;k<hours[n].length;k++) {
            totalNumberOfEntries = totalNumberOfEntries + 1;
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
    ctx.fillText(highestHour,10,9);
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(5,137.5);
    ctx.lineTo(10,137.5);
    ctx.stroke();
    ctx.fillText(Math.floor(highestHour/2),10,141.5);
    console.log(hours);
    var counterForColorForArc = 0;
    for(n=0;n<hours.length;n++) {
        ctx.fillStyle = presetColors[n];
        ctx.font = "16px Trebuchet MS";
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
            var color1 = Math.round((255/totalNumberOfEntries)*counterForColorForArc);
            var color2 = Math.round(255 - ((255/totalNumberOfEntries)*counterForColorForArc));
            var colorForArc = "rgba(" + color1 + ", 127, " + color2 + " , 0.4)";
            ctx.strokeStyle = colorForArc;
            ctx.fillStyle = colorForArc;
            ctx.beginPath();
            //console.log(arrayOfDividers[k] + " " + heightZ + " " + hours[n][k]);
            ctx.arc((singlePoint*(k))+((n)*difference)+(singlePoint/2),heightZ,2,0,2*Math.PI);
            ctx.stroke();
            ctx.closePath();
            ctx.fill();
            counterForColorForArc = counterForColorForArc + 1;
            //console.log("painting?");
        }
    }
    var counterForColor = 0;
    for(n=0;n<hours.length;n++) {
        for(k=0;k<hours[n].length;k++) {
            var draw = 1;
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
            else if(hours[n][k+1] === undefined) {
                try {
                HX = 280 - ((hours[n+1][0] / highestHour) * 275);
                //console.log(hours[n+1][0] + " " + HX);
                }
                catch(err) {
                   draw = 0;
                }
            }
            else {
                HX = 280 - ((hours[n][k+1] / highestHour) * 275);
            }
            if(draw === 1) {
            var color1 = Math.round((255/totalNumberOfEntries)*counterForColor);
            var color2 = Math.round(255 - ((255/totalNumberOfEntries)*counterForColor));
            var color = "rgba(" + color1 + ", 127, " + color2 + " , 1)";
            //console.log(color + "heya");
            ctx.strokeStyle = color;
            //ctx.strokeStyle = presetColors[n];
            ctx.beginPath();
            ctx.moveTo((singlePoint*(k))+((n)*difference)+(singlePoint/2),HZ);
            ctx.lineTo((singlePoint*(k+1))+((n)*difference)+(singlePoint/2),HX);
            ctx.stroke();
            counterForColor = counterForColor + 1;
            }
        }
    }

}

function creatingTweetOverview(dataset) {
    var headlineContainer = document.createElement('div');
    headlineContainer.id = "headlineContainer";
    headlineContainer.className = "headlineContainer";
    document.body.appendChild(headlineContainer);

    var headline = document.createElement('div');
    headline.id = "headline1";
    headline.className = "headline";
    document.getElementById("headlineContainer").appendChild(headline);
    document.getElementById("headline1").innerHTML = "<h3>Most contributions</h3>";

    var headline1 = document.createElement('div');
    headline1.id = "headline2";
    headline1.className = "headline";
    document.getElementById("headlineContainer").appendChild(headline1);
    document.getElementById("headline2").innerHTML = "<h3>Most liked tweets</h3>";

    var headline2 = document.createElement('div');
    headline2.id = "headline3";
    headline2.className = "headline";
    document.getElementById("headlineContainer").appendChild(headline2);
    document.getElementById("headline3").innerHTML = "<h3>Most retweeted tweets</h3>";

    var field = document.createElement('div');
    field.id = "field";
    var length = ((window.innerWidth/3)*1)-10;
    field.style.width  = length + "px";
    field.style.height = "100px";
    field.style.float = "left";
    field.style.marginTop = "50px";
    field.className = "listContainer";
    document.body.appendChild(field);

    var field2 = document.createElement('div');
    field2.id = "field2";
    var length = ((window.innerWidth/3)*1)-10;
    field2.style.width  = length + "px";
    field2.style.height = "100px";
    field2.style.float = "left";
    field2.style.marginTop = "50px";
    field2.className = "listContainer";
    document.body.appendChild(field2);

    var field3 = document.createElement('div');
    field3.id = "field3";
    var length = ((window.innerWidth/3)*1)-10;
    field3.style.width  = length + "px";
    field3.style.height = "100px";
    field3.style.float = "left";
    field3.style.marginTop = "50px";
    field3.className = "listContainer";
    document.body.appendChild(field3);
}

//Display the overall layout of the tweeter-dataset.
function introductonToStatistics(dataset) {
    if(dataInjected === 0) {
       loadTwitterData();
    }
    generateSetup();
    //console.log(globalData);
    sortedDataset = dataset.sort(function(a, b) {return parseFloat(a.datatime) - parseFloat(b.datatime);});
    var endDate = sortedDataset[sortedDataset.length-1].realtime;
    var startDate = sortedDataset[0].realtime;
    var oneDay = 24*60*60*1000;
    var diffDays = Math.ceil(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
    //console.log(startDate + " " + endDate + " number of days between: " + diffDays);
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
    //console.log(authors);
    var tweets = 0;
    for(h=0;h<authors.length;h++) {
        tweets = tweets + authors[h].numberOfTweets;
    }
    //console.log("number of tweets: " + tweets);

    var likes = 0;
    for(o=0;o<globalData.length;o++) {
        likes = likes + globalData[o].likes;
    }
    //console.log("number of likes overall: " + likes);
    var retweets = 0;
    for(n=0;n<globalData.length;n++) {
        retweets = retweets + globalData[n].retweets;
    }
    //console.log("Number of retweets " + retweets);
    //console.log("Number of authors " + " " + authors.length);
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
function showMostRetweeted(dataset,divZ) {
    var datasetNow = dataset;
    datasetNow.sort(function(a, b) {return parseFloat(a.retweets) - parseFloat(b.retweets);});
    datasetNow.reverse();
    console.log(datasetNow);
    for(h=0;h<datasetNow.length;h++) {
        var fieldX = document.createElement('div');
        fieldX.id = "contributorField3-" + h;
        if(h % 2) {
            fieldX.className = "listContainerEntry even";
        }
        else {
            fieldX.className = "listContainerEntry unEven";
        }
        document.getElementById(divZ).appendChild(fieldX);
        document.getElementById("contributorField3-"+h).innerHTML = "<div><a href='" + datasetNow[h].link + "' target='_blank'>" +  datasetNow[h].tweet + "</a></div><div class='tweetInfo'> (<i><a href='http://www.twitter.com/" + datasetNow[h].handle.substring(1) + "'>" + datasetNow[h].handle + "</i>) - " + datasetNow[h].retweets + " retweets</div>";
    }
}
//List of most liked / procentage of all likes on the hashtag in that time interval.
function showMostLiked(dataset,divZ) {
    var datasetNow2 = dataset;
    datasetNow2.sort(function(a, b) {return parseFloat(a.likes) - parseFloat(b.likes);});
    datasetNow2.reverse();
    //console.log(datasetNow2);
    for(x=0;x<datasetNow2.length;x++) {
        var fieldY = document.createElement('div');
        fieldY.id = "contributorField2-" + x;
        if(x % 2) {
            fieldY.className = "listContainerEntry even";
        }
        else {
            fieldY.className = "listContainerEntry unEven";
        }
        console.log(divZ);
        document.getElementById(divZ).appendChild(fieldY);
        document.getElementById("contributorField2-"+x).innerHTML = "<div><a href='" + datasetNow2[x].link + "' target='_blank'>" + datasetNow2[x].tweet + "</a></div><div class='tweetInfo'> (<i><a href='http://www.twitter.com/" + datasetNow2[x].handle.substring(1) + "'>" + datasetNow2[x].handle + "</i>) - " + datasetNow2[x].likes + " likes </div>";
    }
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

function personWithHighestTweets(dataset,div) {
    var allTweets = [];
    var alreadyPresent = 0;
    for(i=0;i<dataset.length;i++) {
        alreadyPresent = 0;
        for(u=0;u<allTweets.length;u++) {
            if(allTweets[u].handle === dataset[i].handle) {
                alreadyPresent = 1;
                allTweets[u].numberOfTweets = allTweets[u].numberOfTweets + 1;
            }
        }
        if(alreadyPresent === 0) {
            var tweeterObject = {
                handle:dataset[i].handle,
                allLikes:dataset[i].likes,
                name:dataset[i].tweeter,
                numberOfTweets:1,
            }
            allTweets.push(tweeterObject);
        }
    }
    allTweets.sort(function(a, b) {return parseFloat(a.numberOfTweets) - parseFloat(b.numberOfTweets);});
    allTweets.reverse();
    for(k=0;k<allTweets.length;k++) {
        allTweets[k].retweetRatio = Math.round(allTweets[k].allLikes/allTweets[k].numberOfTweets *100) / 100;
    }
    console.log(allTweets);
    for(u=0;u<allTweets.length;u++) {
        var fieldZ = document.createElement('div');
        fieldZ.id = "contributorField1-" + u;
        if(u % 2) {
            fieldZ.className = "listContainerEntry even";
        }
        else {
            fieldZ.className = "listContainerEntry unEven";
        }
        document.getElementById(div).appendChild(fieldZ);
        document.getElementById("contributorField1-"+u).innerHTML = "<div class='tweeterName'>" + allTweets[u].name + " (<i><div class='handleOfUser'>" + allTweets[u].handle + "</div></i>) </div><div class='tweeterInfoOfName'>" + allTweets[u].numberOfTweets + " tweets </div>";
        document.getElementById("contributorField1-"+u).onclick=function(){showPersonalStatistics(dataset,this.id);};
    }
}

function showPersonalStatistics(dataset,person) {
    var startDate = findStartDate(dataset);
    var endDate = findEndDate(dataset);
    var days = [];
    var hours = [];
    var existing = 0;
    var nameOfTweeter = "";
    for(n=0;n<dataset.length;n++) {
        existing = 0;
        for(y=0;y<days.length;y++) {
            //console.log(dataset[n].handle + " ---- " + document.getElementById(person).getElementsByClassName("handleOfUser")[0].innerHTML);
            if(dataset[n].realtime.getDate() === days[y][0].realtime.getDate() && dataset[n].realtime.getMonth() === days[y][0].realtime.getMonth() && dataset[n].realtime.getFullYear() === days[y][0].realtime.getFullYear()) {
                if(dataset[n].handle === document.getElementById(person).getElementsByClassName("handleOfUser")[0].innerHTML) {
                nameOfTweeter = dataset[n].tweeter;
                existing = 1;
                days[y].push(dataset[n]);
                }
            }
        }
        if(existing === 0) {
            //console.log("NEW! " + dataset[n].realtime + " " + dataset[n].tweet + " " + dataset[n].datatime);
            if(dataset[n].handle === document.getElementById(person).getElementsByClassName("handleOfUser")[0].innerHTML) {
            days[days.length] = new Array();
            days[days.length-1].push(dataset[n]);
            }
        }
    }
    var oneDay = 24*60*60*1000;
    var diffDays = Math.ceil(Math.abs((startDate.realtime.getTime() - endDate.realtime.getTime())/(oneDay)));
    for(u=0;u<diffDays;u++) {
        hours[hours.length] = new Array();
        for(h=0;h<24;h++) {
            var value = 0;
            hours[hours.length-1].push(value);
        }
    }
    for(i=0;i<days.length;i++) {
        for(h=0;h<days[i].length;h++) {
                var day = Math.ceil(Math.abs((startDate.realtime.getTime() - days[i][h].realtime.getTime())/(oneDay))) - 1;
                var hour = days[i][h].realtime.getHours();
                //console.log(day + " ! " + days[i][h].realtime + " " + hour);
                hours[day][hour] = hours[day][hour] + 1;
        }
    }
    //DRAW HOURS PLXPLX
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    document.getElementById("canvasHeadline").innerHTML = "All tweets in the dataset by " + nameOfTweeter + " <i>(" + document.getElementById(person).getElementsByClassName("handleOfUser")[0].innerHTML + ")</i>" +  " over the entire period of time.";
    ctx.clearRect(0,0,canvas.width,canvas.height);
    console.log(document.getElementById(person).getElementsByClassName("handleOfUser")[0].innerHTML);
    console.log(hours);
}
