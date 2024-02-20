// Loads in the API 

const bac_data_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(bac_data_url).then(function(data){

    // Creates a Dict that has dataset# as the keys to easily switch datasets
    // data_set_list['dataset#'][0] holds metadata indexed to dataset(#-1)
    // data_set_list['dataset#'][1] holds samples indexed to dataset(#-1)
    data_set_list = {};
    for(let x = 0; x < data["names"].length; x++){
        data_set_list[`dataset${x+1}`] = [data["metadata"][x], data["samples"][x]];
    }

    //This code was use to print all 153 options, then I copied that into the Html.  
    text = "" 
    for(let y = 0; y < Object.keys(data_set_list).length; y++){
         text = text + `<option value="dataset${y+1}">${data_set_list[`dataset${y+1}`][0]['id']}</option>\n`
     }
    d3.select("#selDataset").html(text);
    
    // initial charts 
    function init(){
    
    // I used dataset1 to initial lize all charts
    
    // handles intial demo data
	for(k in data_set_list['dataset1'][0]){
          d3.select("#sample-metadata").append("h6").text(`${k}: ${data_set_list["dataset1"][0][k]}\n`);
        }

        // initial bar data
        let data_bar0 = [{
            x: data["samples"][0]["sample_values"].slice(0,10),

            y: data["samples"][0]["otu_ids"].slice(0,10).map(function(take){return `OTU ${take}`;}),

            hovertemplate: data["samples"][0]["otu_labels"].slice(0,10),

            orientation: 'h',
            type: "bar",

            transforms: [{
                type:'sort',
                target: 'y',
                order: 'descending'
            }]
        }]

        // initial bubble data
        let data_bub0 = [{
            x: data["samples"][0]["otu_ids"],

            y: data["samples"][0]["sample_values"],

            mode: 'markers',
            marker: {
                color: data["samples"][0]["otu_ids"], 
                size: data["samples"][0]["sample_values"],
            },

            text: data["samples"][0]["otu_labels"]
        }]

        let layout1 = {
            height: 600,
            width: 800
          };
        
        let layout2 = {
            height: 600,
            width: 800
          }; 
        
        // initial plots   
        Plotly.newPlot("bar", data_bar0, layout1);
        Plotly.newPlot("bubble", data_bub0, layout2);
    }

// This function switches between datasets    
function updatePlotly(){

    //grabs the dataset# from drop menu 
	let dropdownMenu = d3.select("#selDataset");
  	let dataset = dropdownMenu.property("value");
	
	// handles bar chart switching 
	let x2 = data_set_list[dataset][1]["sample_values"].slice(0,10);
	let y2 = data_set_list[dataset][1]["otu_ids"].slice(0,10).map(function(take2){return `OTU ${take2}`;});

	// handles bubble chart switching 

	let y3 = data_set_list[dataset][1]["sample_values"];
	let x3 = data_set_list[dataset][1]["otu_ids"];
	
	// handles the demografic data 
    // first clear out sample-metadata then re-add the info
    d3.select("#sample-metadata").text("")
	for(k in data_set_list[dataset][0]){
         d3.select("#sample-metadata").append("h6").text(`${k}: ${data_set_list[dataset][0][k]}`);
        };

    // this restyles of the charts 
	Plotly.restyle("bar", "x", [x2]);
	Plotly.restyle("bar", "y", [y2]);
	Plotly.restyle("bubble", "x", [x3]);
	Plotly.restyle("bubble", "y", [y3]);

  	console.log(dataset);
    }

// checks for dataset switch    
d3.selectAll("#selDataset").on("change", updatePlotly);

// runs the init
init();
});
