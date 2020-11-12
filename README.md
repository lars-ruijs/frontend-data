# Frontend Data for de Volkskrant

The Dutch newspaper _De Volkskrant_ asked us to find interesting patterns and insights for the subject _"The car in the city"_, using datasets from the RDW. These datasets contain information about parking spaces and registered vehicles in the Netherlands. By using this data we can create interactive data visualizations using JavaScript and D3.

More information about De Volkskrant can be found at [Wikipedia (English)](https://en.wikipedia.org/wiki/De_Volkskrant) or at [Volkskrant.nl (Dutch)](https://www.volkskrant.nl/).

All of the RDW datasets can be found [here](https://opendata.rdw.nl/browse).

## 📊 Visualization

![image](https://user-images.githubusercontent.com/60745347/98987259-5598e300-2526-11eb-9f01-7aef6205d33e.png)

I created an interactive visualization that shows how the P+R parking capacity is distributed in cities. When you press a bar from the barchart, a pie chart shows how the number of parking spaces of the P+R locations within that city is distributed. View the visualization [here](https://lars-ruijs.github.io/frontend-data/rdw-data/).

I've used sources below as an example:

- **Making a bar chart with D3** YouTube video by Curran Kelleher. View the video [here](https://www.youtube.com/watch?v=NlBt-7PuaLk&list=PL9yYRbwpkykvOXrZumtZWbuaXWHvjD8gi&index=7).
- **Customizing Axes of a bar chart** YouTube video by Curran Kelleher. View the video [here](https://www.youtube.com/watch?v=c3MCROTNN8g&list=PL9yYRbwpkykvOXrZumtZWbuaXWHvjD8gi&index=9).
- **Interactive Pie chart** an example from D3 Graph Gallery. View the example [here](https://www.d3-graph-gallery.com/graph/pie_changeData.html).
- **Pie chart with annotation** an example from D3 Graph Gallery. View the example [here](https://www.d3-graph-gallery.com/graph/pie_annotation.html)

## 💡 Concept

### 🔎 Research question

With my data visualization I want to address the following topic:

> How are Park & Ride locations distributed across the Netherlands?

With this question I have thought of several subquestions, which focus more deeply on the subject of Park & Ride locations.

- How far are the P+R locations from the city center?
- Which city has the most P+R locations?
- How large is the parking capacity of these locations?
- Do the P+R locations offer facilities for the disabled?
- Are the number of P+R locations in the Netherlands increasing?
- Which P+R locations offer a connection to a train station?

### 💭 Assumptions

I don't expect small towns to have a P+R location. I expect that the bigger the city, the further away a park and ride location is from the city center. I think the city of Amsterdam has the most P+R locations with a high parking capacity. I expect that commercial providers hardly own any P+R locations. I expect that most P+R locations have a train station within walking distance.

### 📊 Interesting variables

**From dataset "GEO PenR":**
<br>
You can view the data inside this data set [here](https://opendata.rdw.nl/Parkeren/GEO-PenR/6wzd-evwu).

- `Location` gives the location of a P+R facility as an object with coordinates. <br> _Example output: `{latitude: "53.165117644", longitude: "5.829843478"}`;_ <br><br>
- `AreaDesc` contains the name of the P+R location including the city name where the P+R site is located. <br> _Example output: `"Park & Ride Barchman Wuytierslaan (Amersfoort)"`;_ <br><br>
- `StartDataArea` contains the date on which the P+R location was first opened. Formated as YYYYMMDD. <br> _Example output: `20131118`;_ <br><br>
- `AreaManagerId` provides an identification number of the P+R site administrator. <br> _Example output: `2448`;_ <br><br>
- `AreaId` contains a unique identification number of the parking site. This can be used to collect more information about a P+R location from another dataset within the RDW. <br> _Example output: `"307_BARC"`._ <br><br>

**From dataset "Specificaties Parkeergebied":**
<br>
You can view the data inside this data set [here](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-SPECIFICATIES-PARKEERGEBIED/b3us-f26s)

- `AreaId` contains a unique identification number of the parking site. I can use this to connect it to the "GEO PenR" dataset. <br> _Example output: `"307_BARC"`;_ <br><br>
- `Capacity` returns the amount of parking spots a given location has. I can use this to show how large a P+R parking site is. <br> _Example output: `48`;_ <br><br>
- `DisabledAccess` gives the number of reserved parking spaces for disabled people. <br> _Example output: `2`._ <br><br>

**From dataset "Gebiedsbeheerder":**
<br>
You can view the data inside this data set [here](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-GEBIEDSBEHEERDER/2uc2-nnv3)

- `AreaManagerId` provides an identification number of a parking site administrator. <br> _Example output: `2448`;_ <br><br>
- `AreaManagerDesc` shows the name of the owner of a parking location. <br> _Example output: `"Hoorn"`;_ <br><br>

If it is possible I would like to include data about train stations in the Netherlands. I found an API from the NS (the Dutch Railway operator) that contains information about all train stations.

**From dataset "Stations" by NS:**
<br>
You can view the data inside this data set [here](https://apiportal.ns.nl/docs/services/reisinformatie-api/operations/getAllStations). Please note that this link will only work if you are logged in with an NS-API Portal account.

- `stationType` gives information about the type of station. <br> _Example output: `"INTERCITY_STATION"`;_ <br><br>
- `lat` and `lng` give the coordinates of the station. <br> _Example output: `52.5486327`;_ <br><br>
- `heeftReisassistentie` provides information about whether people with disabilities can make use of assistance to use a train. <br> _Example output: `false`;_ <br><br>
- `namen` returns the official name of a station. <br> _Example output: `"Amsterdam Centraal"`._

If I can integrate this information, it might also be possible to show specific information for people with disabilities. Are there P+R locations with a reserved disabled parking space and can they then transfer to a station that has passenger assistance?
<br><br>
To convert the city name of a P+R parking location to usable latitude and longitude coordinates, I need an API that provides this as a service. I want to use the geocoding service from HERE for this.

**From dataset "Geocode" by HERE Maps API:**
<br>
You can view more information about this data set [here](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-geocode-brief.html).

- `position` gives information about the latitude and longitude coordinates of a given city. <br> _Example output: `{"lat": 51.82611, "lng": 4.83329}`;_ <br><br>

To give information about travel time with public transportation for the last part of the trip (traveling between P+R location and city center) I need an API that can give a travel adivse between two coordinates. I want to use the Publice Transit API from HERE for this.

**From dataset "Public Transit" by HERE Maps API:**
<br>
You can view more information about this data set [here](https://developer.here.com/documentation/public-transit/dev_guide/routing/route-example.html).

- `departure` gives information about the departure time of the transit journey. <br> _Example output: `{ "time":"2020-10-30T11:57:00+01:00" }`;_ <br><br>
- `arrival` gives information about the arrival time of the transit journey. <br> _Example output: `{ "time":"2020-10-30T12:37:00+01:00" }`;_ <br><br>

When calculating the difference between the first departure time and the last arrival time, you know the actual travel time for a journey.

### ⬜️ Empty values

When a dataset contains empty values, I will either not use the empty cells or interpert the value in a cell as null. This depends of course on what the subject of the corresponding column is. Below are the empty values I came across and what I did with them:

- Inside the dataset [PenR GEO](https://opendata.rdw.nl/Parkeren/GEO-PenR/6wzd-evwu), there was one P+R location without an `AreaDesc` (the name of a P+R location plus the city name). Because of this, I put the name as `null` and the place name as `null` as well.

- About 54 `areaId`s (unique identification numbers) of P+R locations were missing from the dataset [Specificaties Parkeergebied](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-SPECIFICATIES-PARKEERGEBIED/b3us-f26s). This means, among other things, that I can't get any information about parking capacity from them. I set the capacity of these locations to 1, because I need the capacity to create a pie chart. In this way, the missing capacities are still visible and D3 can work with them.

I haven't come across any other missing data, but I have specified in my code that if there are missing values, they will be replaced for null.

### ✏️ Sketch of my concept (so far)

I would like to visualise the spread of P+R locations across the country and show the distance between a city centre and a P+R location. The first example below is without a map background. The other sketches do have a simple map as background, because I think this helps to visualize the spread of P+R locations over smaller places in the country. <br><br>
After receiving feedback from de Volkskrant, I decided to first make a general visualization of P+R parking capacity divided over cities. See the sketch below:

<br>

![IMG_2763](https://user-images.githubusercontent.com/60745347/98966364-799afb00-250b-11eb-831c-aa601fff6762.JPG)

Here a user selects a bar from the barchart to get a pie chart with more information on how the P+R parking capacity is distributed in the selected city.

<br>

![schets zonder kaart als achtergrond](https://user-images.githubusercontent.com/60745347/97630497-fe781600-1a2f-11eb-847f-fdda331a2977.JPG)

<br>

![schets met kaart als achtergrond](https://user-images.githubusercontent.com/60745347/98243611-7a151e00-1f6e-11eb-9bf0-cf9d05fffd91.jpg)

Sketch with the option to filter displayed P+R facilities by travel time for the last part of the journey (journey between parking lot and city center).

<br>

<img src="https://user-images.githubusercontent.com/60745347/98243811-c3656d80-1f6e-11eb-883d-a8557f75133b.png" alt="digitale schets" width="70%" />

Digital sketch based on the second draft.

<br>

## 🛁 Survey data cleaning with functional patterns

This function cleans the coordinates in the column "place of birth". First of all, an array is created with `map()` of the values in the column. This array is directly filtered on empty values using `filter()`. Then a function checks if the coordinates need to be converted from the "degree, minute and seconds"-format to a decimal format. If so, it does so and places the result as an object in a new array. If the coordinate doesn't have to get converted, weird characters will be filtered out and the string coordinates will be cut into an object with a lattitude and longitude. This object is placed back in the array.
Finally the function removes 11 invalid coordinates. These are for example coordinates with invalid degree indicators or coordinates that only contain a lattitude (or longitude).

You can view that code [here](https://github.com/lars-ruijs/functional-programming/blob/4ab79d869b5386325b86b3ad64bb34921343c8c3/survey-cleaning/scripts/script.js#L84-L125).

## 🗒 Sources

I've used the following sources while working on my project:

### Survey data cleaning

- **JSON Dataset** generated by my classmate Jonah Meijers.
- **Loading JSON data locally (work-around)** lecture by Tech Track teachers Robert and Laurens.
- **Using `filter()` and `map()`** lectures by Laurens. Documentation about [filter()](https://developer.mozilla.org/nl/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) and [map()](https://developer.mozilla.org/nl/docs/Web/JavaScript/Reference/Global_Objects/Array/map) used from MDN.
- **Using unary operator for converting string values to numbers** article by Nikhil John on Medium. Read it [here](https://medium.com/@nikjohn/cast-to-number-in-javascript-using-the-unary-operator-f4ca67c792ce).
- **Removing an item from a string and replacing it's value** [documentation](https://developer.mozilla.org/nl/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) about `splice()` used from MDN.
- **Replacing quotes and degree characters** adapted RegEx code from a StackOverflow [answer](https://stackoverflow.com/questions/7760262/replace-both-double-and-single-quotes-in-javascript-string) by Joe.
- **Using `test()` to check if a string contains letters** code adapted from a StackOverflow [answer](https://stackoverflow.com/questions/23476532/check-if-string-contains-only-letters-in-javascript/23476587) by Oriol. Used additional `test()` [documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test) from MDN.
- **Convert coordinates in Degree, Minute, Seconds format to decimal values** code adapted from a StackOverflow [answer](https://stackoverflow.com/questions/1140189/converting-latitude-and-longitude-to-decimal-values) by Gavin Miller.

### RDW data cleaning

- **Dataset GEO P&R** from the RDW. View the dataset [here](https://opendata.rdw.nl/Parkeren/GEO-PenR/6wzd-evwu).
- **Dataset Specificaties Parkeergebied** from the RDW. View the dataset [here](https://opendata.rdw.nl/Parkeren/Open-Data-Parkeren-SPECIFICATIES-PARKEERGEBIED/b3us-f26s).
- **Geocoding API** powered by HERE Maps. Used for finding coordinate data from city names. Learn more about the API [here](https://developer.here.com/documentation/geocoding-search-api/dev_guide/topics/endpoint-geocode-brief.html).
- **Counting duplicate values and removing the duplicates** code adapted from from a StackOverflow [answer](https://stackoverflow.com/questions/49676897/javascript-es6-count-duplicates-to-an-array-of-objects) by Eddie.
- **Using async/await inside map** code adapted from an article by [Zell Liew](https://zellwk.com/blog/async-await-in-loops/).
- **Check if data is valid** a lecture by Tech Track teacher Laurens.
- **Extract years from a string** used documentation about substring() from [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring).
- **Extraxt text between parentheses** RegEx code adapted from a StackOverflow [answer](https://stackoverflow.com/questions/17779744/regular-expression-to-get-a-string-between-parentheses-in-javascript) by go-oleg.
- **Fetching data and coverting to JSON** a lecture by Tech Track teacher Laurens.

### Making a D3 visualization

- **Making a bar chart with D3** YouTube video by Curran Kelleher. View the video [here](https://www.youtube.com/watch?v=NlBt-7PuaLk&list=PL9yYRbwpkykvOXrZumtZWbuaXWHvjD8gi&index=7).
- **Customizing Axes of a bar chart** YouTube video by Curran Kelleher. View the video [here](https://www.youtube.com/watch?v=c3MCROTNN8g&list=PL9yYRbwpkykvOXrZumtZWbuaXWHvjD8gi&index=9).
- **Interactive Pie chart** an example from D3 Graph Gallery. View the example [here](https://www.d3-graph-gallery.com/graph/pie_changeData.html).
- **Pie chart with annotation** an example from D3 Graph Gallery. View the example [here](https://www.d3-graph-gallery.com/graph/pie_annotation.html)

## 🔗 License

This repository is licensed as [MIT](https://github.com/lars-ruijs/functional-programming/blob/main/LICENSE) • ©️ 2020 Lars Ruijs
