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
                        //console.log(object.realtime + " " + object.tweet);
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
    sanatizeData(globalData);
    introductonToStatistics(globalData,"DST4L");
    creatingTweetOverview(globalData);
    showEntireEventTweetProgress(globalData);
    personWithHighestTweets(globalData,"field");
    showMostLiked(globalData,"field2");
    showMostRetweeted(globalData,"field3");
    sortDatasetAfterDate(globalData);
    personalOutwardRelations(globalData,"@knanton");
    //plotDataForAllDaysIn24HourInterval(globalData);
}

function reshowFirstTwitterData() {
    showEntireEventTweetProgress(globalData);
    document.getElementById("field").innerHTML = "";
    personWithHighestTweets(globalData,"field");
    document.getElementById("field2").innerHTML = "";
    showMostLiked(globalData,"field2");
    document.getElementById("field3").innerHTML = "";
    showMostRetweeted(globalData,"field3");
}

function sortDatasetAfterDate(dataset,argument) {
    var timeSortedDataset = dataset;
    timeSortedDataset.sort(function(a, b) {return parseFloat(a.realtime.getTime()) - parseFloat(b.realtime.getTime());});
    //console.log(timeSortedDataset);
    if(argument === 0) {
        //console.log("startdate: " + timeSortedDataset[0].realtime);
        return timeSortedDataset[0];
    }
    else if(argument === 1) {
        //console.log("enddate: " + timeSortedDataset[timeSortedDataset.length-1].realtime);
        return timeSortedDataset[timeSortedDataset.length-1];
    }
    else {
        return "0";
    }
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
    //console.log(arrayOfDividers);
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
    //console.log(days);
}

function showEntireEventTweetProgress(dataset,person) {
    var presetColors= ["rgba(255, 0, 255, 0.5)","rgba(0, 0, 255, 0.5)","rgba(0, 255, 255, 0.5)","rgba(0, 128, 128, 0.5)","rgba(0, 255, 0, 0.5)","rgba(255, 255, 0, 0.5)","rgba(255, 0, 0, 0.5)","rgba(192, 192, 192, 0.5)","rgba(0, 0, 0, 0.5)","rgba(255,69,0, 0.5)"];
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    document.getElementById("canvasHeadline").innerHTML = "All tweets in the dataset over the entire period of time.";
    sortedDataset = globalData.sort(function(a, b) {return parseFloat(a.realtime.getTime()) - parseFloat(b.realtime.getTime());});
    //console.log("---");
    var endDate = sortDatasetAfterDate(dataset,1);
    var startDate = sortDatasetAfterDate(dataset,0);
    var calDate = new Date(startDate.realtime.getTime());
    var startDateToText = new Date();
    startDateToText.setTime(startDate.realtime.getTime());
    //console.log(sortedDataset);
    //console.log(startDate);
    //console.log(endDate);
    var daysBetween = 0;
    for(u=0;u<1;) {
        //console.log(calDate + " " + endDate.realtime + "    .....");
        if(calDate.getFullYear() <= endDate.realtime.getFullYear() && calDate.getMonth() <= endDate.realtime.getMonth() && calDate.getDate() <= endDate.realtime.getDate()) {
            daysBetween = daysBetween + 1;
        }
        else {
            u = 1;
        }
        calDate.setDate(calDate.getDate() + 1);
    }
    //console.log(daysBetween + " bitch.");
    //var oneDay = 24*60*60*1000;
    var diffDays = daysBetween;
    //var diffDays = Math.round(Math.abs((startDate.realtime.getTime() - endDate.realtime.getTime())/(oneDay)));
    //console.log(Math.ceil(Math.abs((startDate.realtime.getTime() - endDate.realtime.getTime())/(oneDay))));
    //console.log(Math.abs((startDate.realtime.getTime() - endDate.realtime.getTime())/(oneDay)));
    //console.log(startDate.realtime + " " + endDate.realtime);
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
    console.log(days);
    days.reverse();
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
    //console.log(hours);
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
    var overallContainerForLists = document.createElement('div');
    overallContainerForLists.id = "overallContainerForLists";
    overallContainerForLists.className = "overallContainerForLists";
    document.body.appendChild(overallContainerForLists);


    var headlineContainer = document.createElement('div');
    headlineContainer.id = "headlineContainer";
    headlineContainer.className = "headlineContainer";
    document.getElementById("overallContainerForLists").appendChild(headlineContainer);

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
    document.getElementById("overallContainerForLists").appendChild(field);

    var field2 = document.createElement('div');
    field2.id = "field2";
    var length = ((window.innerWidth/3)*1)-10;
    field2.style.width  = length + "px";
    field2.style.height = "100px";
    field2.style.float = "left";
    field2.style.marginTop = "50px";
    field2.className = "listContainer";
    document.getElementById("overallContainerForLists").appendChild(field2);

    var field3 = document.createElement('div');
    field3.id = "field3";
    var length = ((window.innerWidth/3)*1)-10;
    field3.style.width  = length + "px";
    field3.style.height = "100px";
    field3.style.float = "left";
    field3.style.marginTop = "50px";
    field3.className = "listContainer";
    document.getElementById("overallContainerForLists").appendChild(field3);
}

function createFinalPersonalVisualization() {
    var personalVisualization = document.createElement('div');
    personalVisualization.id = "personalVisualization";
    personalVisualization.className = "personalVisualizationContainer";
    //document.body.appendChild(personalVisualization);
    //document.getElementsByClassName("introContainer")[0].parentNode.appendChild(personalVisualization);
    document.getElementsByClassName("overallContainerForLists")[0].insertBefore(personalVisualization, document.getElementsByClassName("overallContainerForLists")[0].children[0]);
}

//Display the overall layout of the tweeter-dataset.
function introductonToStatistics(dataset,argument) {
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
    var text = "<h3>Breakdown of #DST4L</h3><p>This dataset contains tweets from <strong>" + diffDays + "</strong> days, the " + startDate.getDate() + "/" + startDate.getMonth() + "-" + startDate.getFullYear() + " to " + endDate.getDate() + "/" + endDate.getMonth() + "-" + endDate.getFullYear() + ", which was <strong>" + tweets + "</strong> tweets written by <strong>" + authors.length + "</strong> authors using the hashtag #" + argument + ". This means an average of <strong>" + tweets/diffDays + "</strong> tweets per day. There was a total of <strong>" + likes + "</strong> likes on these tweets, giving an average of <strong>" + (likes/tweets).toFixed(2) + "</strong> likes per tweet. There was <strong>" + retweets + "</strong> retweets on these tweets, giving an average of <strong>" + (retweets/tweets).toFixed(2) + "</strong> retweets per tweet.</p>";
    document.getElementById("intro").innerHTML += text;
    addResetButton();
}


//Show Number of tweets, number of likes all over, number of tweeters, mosts tweets in what hour, etc.
function showOverallStatisticsForPerson(dataset, person) {
    var numberOfTweets = 0;
    var averageNumberOfTweets = 0;
    var numberOfLikes = 0;
    var numberOfRetweets = 0;
    var text = "<h3>Breakdown of " + person.handle + "</h3><p>User tweeted + " + numberOfTweets + " times during the entire measured period, which averages as " + averageNumberOfTweets + " tweets per day. These tweets recieved " + numberOfLikes + " likes, which averages " + (numberOfLikes/numberOfTweets).toFixed(2) + " likes per tweet, and " + numberOfRetweets + " retweets, which averages " + (numberOfRetweets/numberOfTweets).toFixed(2) + " retweets per tweet.</p>";
    document.getElementById("intro").innerHTML += text;
    addResetButton();
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
    //console.log(contributors);
}

//List of most retweeted / procentage of retweets from the entire retweeters.
function showMostRetweeted(dataset,divZ) {
    var datasetNow = dataset;
    datasetNow.sort(function(a, b) {return parseFloat(a.retweets) - parseFloat(b.retweets);});
    datasetNow.reverse();
    //console.log(datasetNow);
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
        //console.log(divZ);
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
    //console.log(retweeters);
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
    //console.log(likes);
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
    //console.log(allTweets);
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
    removePersonalStatistics();
    var startDate = sortDatasetAfterDate(dataset,0);
    var endDate = sortDatasetAfterDate(dataset,1);
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
    //console.log("here!");
    //console.log(startDate.realtime);
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
                var day = Math.ceil(Math.abs((startDate.realtime.getTime() - days[i][h].realtime.getTime())/(oneDay)));
                if(day != 0) {
                    day = day - 1;
                }
                var hour = days[i][h].realtime.getHours();
                //console.log(day + " ! " + days[i][h].realtime + " " + hour);
                //console.log(days[i][h]);
                hours[day][hour] = hours[day][hour] + 1;
        }
    }
    //DRAW HOURS PLXPLX
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    document.getElementById("canvasHeadline").innerHTML = "All tweets in the dataset by " + nameOfTweeter + " <i>(" + document.getElementById(person).getElementsByClassName("handleOfUser")[0].innerHTML + ")</i>" +  " over the entire period of time.";
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var startDateToText = new Date();
    startDateToText.setTime(startDate.realtime.getTime());
    var difference = canvas.width/diffDays;
    var singlePoint = (canvas.width/diffDays)/24;
    var startSinglePoint = singlePoint/2;
    for(u=0;u<diffDays;u++) {
        for(y=1;y<24;y++) {
            ctx.strokeStyle = "#000000";
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
    ctx.strokeStyle = "#000000";
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
    //hours.reverse();
    //days.reverse();
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
        ctx.fillStyle = "white";
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
    mostPersonalLikedTweets(globalData,document.getElementById(person).getElementsByClassName("handleOfUser")[0].innerHTML,"field2");
    mostPersonalRetweetedTweets(globalData,document.getElementById(person).getElementsByClassName("handleOfUser")[0].innerHTML,"field3");
    createFinalPersonalVisualization();
    //console.log(document.getElementById(person).getElementsByClassName("handleOfUser")[0].innerHTML);
    //console.log(hours);
}

function mostPersonalLikedTweets(dataset, handle,div) {
    document.getElementById(div).innerHTML = "";
    var tweets = [];
    for(i=0;i<dataset.length;i++) {
        if(dataset[i].handle === handle) {
            tweets.push(dataset[i]);
        }
    }
    tweets.sort(function(a, b) {return parseFloat(a.likes) - parseFloat(b.likes);});
    tweets.reverse();
    console.log(tweets);
    for(u=0;u<tweets.length;u++) {
        var fieldZ = document.createElement('div');
        fieldZ.id = "contributorField2-" + u;
        if(u % 2) {
            fieldZ.className = "listContainerEntry even";
        }
        else {
            fieldZ.className = "listContainerEntry unEven";
        }
        document.getElementById(div).appendChild(fieldZ);
        //console.log(tweets[u].tweet + " " + tweets[u].likes + "<br/> ----");
        document.getElementById("contributorField2-"+u).innerHTML = "<div><a href='" + tweets[u].link + "' target='_blank'>" + tweets[u].tweet + "</a></div><div class='tweetInfo'> (<i><a href='http://www.twitter.com/" + tweets[u].handle.substring(1) + "'>" + tweets[u].handle + "</i>) - " + tweets[u].likes + " likes </div>";
    }
}

function mostPersonalRetweetedTweets(dataset, handle, div) {
    document.getElementById(div).innerHTML = "";
    var tweets = [];
    for(i=0;i<dataset.length;i++) {
        if(dataset[i].handle === handle) {
            tweets.push(dataset[i]);
        }
    }
    tweets.sort(function(a, b) {return parseFloat(a.retweets) - parseFloat(b.retweets);});
    tweets.reverse();
    console.log(tweets);
    for(u=0;u<tweets.length;u++) {
        var fieldZ = document.createElement('div');
        fieldZ.id = "contributorField3-" + u;
        if(u % 2) {
            fieldZ.className = "listContainerEntry even";
        }
        else {
            fieldZ.className = "listContainerEntry unEven";
        }
        document.getElementById(div).appendChild(fieldZ);
        //console.log(tweets[u].tweet + " " + tweets[u].likes + "<br/> ----");
        document.getElementById("contributorField3-"+u).innerHTML = "<div><a href='" + tweets[u].link + "' target='_blank'>" + tweets[u].tweet + "</a></div><div class='tweetInfo'> (<i><a href='http://www.twitter.com/" + tweets[u].handle.substring(1) + "'>" + tweets[u].handle + "</i>) - " + tweets[u].retweets + " retweets </div>";
    }
}

function sanatizeData(dataset) {
    for(i=0;i<dataset.length;i++) {
        if(dataset[i].tweet.indexOf("pic.twitter.com") != -1) {
            //console.log(dataset[i].tweet.indexOf("pic.twitter.com"));
            //console.log(dataset[i].tweet);
            if(dataset[i].tweet.charAt(dataset[i].tweet.indexOf("pic.twitter.com")-1) != " ") {
                dataset[i].tweet = [dataset[i].tweet.slice(0, dataset[i].tweet.indexOf("pic.twitter.com")), " ", dataset[i].tweet.slice(dataset[i].tweet.indexOf("pic.twitter.com"))].join('');
                //console.log("New: " + dataset[i].tweet);
            }
        }
        if(dataset[i].tweet.indexOf("http://") != -1) {
            if(dataset[i].tweet.charAt(dataset[i].tweet.indexOf("http://")-1) != " ") {
                dataset[i].tweet = [dataset[i].tweet.slice(0, dataset[i].tweet.indexOf("http://")), " ", dataset[i].tweet.slice(dataset[i].tweet.indexOf("http://"))].join('');
                //console.log("New: " + dataset[i].tweet);
            }
        }
        if(dataset[i].tweet.indexOf("https://") != -1) {
            if(dataset[i].tweet.charAt(dataset[i].tweet.indexOf("https://")-1) != " ") {
                dataset[i].tweet = [dataset[i].tweet.slice(0, dataset[i].tweet.indexOf("https://")), " ", dataset[i].tweet.slice(dataset[i].tweet.indexOf("https://"))].join('');
                console.log("New: " + dataset[i].tweet);
            }
        }
    }
}

function addResetButton() {
    var resetButton = document.createElement('div');
    resetButton.id = "resetButton";
    resetButton.className = "resetButton";
    document.getElementById("intro").appendChild(resetButton);
    document.getElementById("resetButton").innerHTML = "Reload overall statistics";
    document.getElementById("resetButton").onclick=function(){reshowFirstTwitterData();removePersonalStatistics();};
}

function removePersonalStatistics() {
    if(!document.getElementById("personalVisualization")) {
    }
    else {
   document.getElementById("personalVisualization").parentNode.removeChild(document.getElementById("personalVisualization"));
    }
}

//https://jsfiddle.net/m96zt8mb/ - skal bruges til at smække opsætningen op.

//  Fix %-wheel with procent of tweets that was liked.
function likesOnTweets(dataset,person) {

}

// Fix %-wheel with procent of tweets that was retweeted.
function retweetsOfTweets(dataset, person) {

}

// Fix %-wheel with procent of tweets had engagement with other users.
function engangementInTweets(dataset, person) {

}

// Fix %-wheel number of tweets from person of entire dataset.
function tweetsOfEntireSet(dataset,person) {

}

// Simple function to create the wheel
function createDiagram(div,id,info,procent,color1,color2,size) {
	var canvasForProcentages = document.createElement('canvas');
  canvasForProcentages.id = "canvasForProcentages" + id;
  canvasForProcentages.className = "canvasForProcentages";
  canvasForProcentages.width = size;
  canvasForProcentages.height = size;
  document.getElementById(div).appendChild(canvasForProcentages);
  var canvasForProcentagesCtx = canvasForProcentages.getContext("2d");
	var lastend = 0;
	var data = [procent,100-procent]; // If you add more data values make sure you add more colors
	var myTotal = 0; // Automatically calculated so don't touch
	var myColor = [color1,color2]; // Colors of each slice

	for (var e = 0; e < data.length; e++) {
 	 myTotal += data[e];
	}

	for (var i = 0; i < data.length; i++) {
 	 	canvasForProcentagesCtx.fillStyle = myColor[i];
  	canvasForProcentagesCtx.beginPath();
 	 	canvasForProcentagesCtx.moveTo(canvasForProcentages.width / 2, canvasForProcentages.height / 2);
 			 // Arc Parameters: x, y, radius, startingAngle (radians), endingAngle (radians), antiClockwise (boolean)
       console.log(canvasForProcentages.height);
  	canvasForProcentagesCtx.arc(canvasForProcentages.width / 2, canvasForProcentages.height / 2, canvasForProcentages.height / 2, lastend, lastend + 		(Math.PI * 2 * (data[i] / myTotal)), false);
  	canvasForProcentagesCtx.lineTo(canvasForProcentages.width / 2, canvasForProcentages.height / 2);
  	canvasForProcentagesCtx.fill();
  	lastend += Math.PI * 2 * (data[i] / myTotal);
	}
	canvasForProcentagesCtx.fillStyle = "#FFFFFF";
	canvasForProcentagesCtx.beginPath();
	canvasForProcentagesCtx.moveTo(canvasForProcentages.width / 2, canvasForProcentages.height / 2);
	canvasForProcentagesCtx.arc(canvasForProcentages.width / 2,canvasForProcentages.height / 2,(canvasForProcentages.height / 2)-(canvasForProcentages.height / 10),0,2*Math.PI);
	canvasForProcentagesCtx.fill();
  var infoDiv = document.createElement('div');
  infoDiv.id = "info" + id;
  infoDiv.className = "infoDivForPie";
  infoDiv.style.width = size + "px";
  infoDiv.style.height = size + "px";
  infoDiv.style.marginTop = -size - 4 + "px";
  infoDiv.style.lineHeight = size + "px";
  infoDiv.style.textAlign = "center";
  infoDiv.style.fontSize = size/3.5 + "px";
  infoDiv.style.color = color1;
  document.getElementById(div).appendChild(infoDiv);
  document.getElementById("info" + id).innerHTML = procent + "%";
}

function personalOutwardRelations(dataset,person) {
    var tweetArray = [];
    for(h=0;h<dataset.length;h++) {
        if(dataset[h].handle === person) {
            tweetArray.push(dataset[h]);
        }
    }
    for(j=0;j<tweetArray.length;j++) {
        //console.log(tweetArray[j].tweet);
        var counter = (tweetArray[j].tweet.match(/@/g)||[]).length;
        var lastIndex = 0;
        var name;
        for(f=0;f<counter;f++) {
            name = "";
            name = tweetArray[j].tweet.substr(tweetArray[j].tweet.indexOf("@",lastIndex),tweetArray[j].tweet.indexOf(" ",tweetArray[j].tweet.indexOf("@",lastIndex)+1)-tweetArray[j].tweet.indexOf("@",lastIndex));
            if(name === "" && tweetArray[j].tweet.indexOf(" ",tweetArray[j].tweet.indexOf("@",lastIndex)+1) === -1) {
                name = tweetArray[j].tweet.substr(tweetArray[j].tweet.indexOf("@",lastIndex),tweetArray[j].tweet.indexOf(" ",(tweetArray[j].tweet.length-1)-tweetArray[j].tweet.indexOf("@",lastIndex)));
            }
            if(name.charAt(name.length -1) === "." || name.charAt(name.length -1) === "!" || name.charAt(name.length -1) === "?" || name.charAt(name.length -1) === ",") {
                name = name.slice(0, -1);
            }
            if(name.substr(name.length - 2,2) === "’s") {
                name = name.slice(0,-2);
            }
            console.log(f + " at: " + tweetArray[j].tweet.indexOf("@",lastIndex) + " to " + tweetArray[j].tweet.indexOf(" ",tweetArray[j].tweet.indexOf("@",lastIndex)+1) + " name: " + name);
            lastIndex = tweetArray[j].tweet.indexOf("@",lastIndex) + 1;
        }
        //console.log(counter);
    }
}
