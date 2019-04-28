import { Component, OnInit } from '@angular/core';

import { RestApiService } from '../../services/http/rest-api.service';
import { AuthenticationService } from '../../services/user/authentication.service';
import { RtcService } from '../../services/rtc/rtc.service';

import * as d3 from 'd3'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

	sessionData: any;
	data: any = [];
	loading: boolean = true;

	constructor(
		private restApi: RestApiService,
		  private authService: AuthenticationService,
		  private rtcService: RtcService
	) {
		this.sessionData = this.authService.getSessionData();
	}

	ngOnInit() {
		// const connectionOptions = {
		// 	publicRoomIdentifier: 'live-group-trainings',
		// 	socketMessageEvent:  'live-group-trainings'
		// }

		// this.rtcService.create(connectionOptions).then((connection: any) => {
		// 	connection.connectSocket((socket: any) => {
		// 		connection.socket.emit('get-public-rooms', connectionOptions.publicRoomIdentifier, function(listOfRooms) {
		// 			console.log(listOfRooms);
		// 		});
		// 	});
		// });
	}

	ngAfterContentInit() {
		this.loading = null;

		setTimeout(() => {
			this.drawGraphActivity();
		}, 1000);
	}

	drawGraphActivity() {
		// set the dimensions and margins of the graph
		const margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 960 - margin.left - margin.right,
		height = 300 - margin.top - margin.bottom,
		color = { 'practice-time': 'secondary', 'show-time': 'primary' };

		// parse the date / time
		let parseTime = d3.timeParse("%d-%b-%y");

		// set the ranges
		let x = d3.scaleTime().range([0, width]);
		let y = d3.scaleLinear().range([height, 0]);

		// define the line
		let valueline = d3.line()
			.x((d) => { return x(d.date); })
			.y((d) => { return y(d.close); })
			.curve(d3.curveMonotoneX);

		// append the svg obgect to the body of the page
		// appends a 'group' element to 'svg'
		// moves the 'group' element to the top left margin
		let svg = d3.select("#activityGraph").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform",
				"translate(" + margin.left + "," + margin.top + ")");

		// Get the data
		let data = [
			{ date: '30-Apr-19', close: 0, type: 'show-time' },
			{ date: '28-Apr-19', close: 5, type: 'show-time' },
			{ date: '25-Apr-19', close: 3, type: 'show-time' },
			{ date: '22-Apr-19', close: 1, type: 'show-time' },
			{ date: '20-Apr-19', close: 8, type: 'show-time' },
			{ date: '17-Apr-19', close: 2, type: 'show-time' },
			{ date: '16-Apr-19', close: 5, type: 'show-time' },
			{ date: '13-Apr-19', close: 2, type: 'show-time' },
			{ date: '11-Apr-19', close: 1, type: 'show-time' },
			{ date: '7-Apr-19', close: 1, type: 'show-time' },
			{ date: '6-Apr-19', close: 3, type: 'show-time' },
			{ date: '1-Apr-19', close: 1, type: 'show-time' },
			{ date: '30-Mar-19', close: 4, type: 'show-time' },
			{ date: '25-Mar-19', close: 0, type: 'show-time' },
			{ date: '30-Apr-19', close: 0, type: 'practice-time' },
			{ date: '26-Apr-19', close: 2, type: 'practice-time' },
			{ date: '21-Apr-19', close: 5, type: 'practice-time' },
			{ date: '19-Apr-19', close: 2, type: 'practice-time' },
			{ date: '11-Apr-19', close: 6, type: 'practice-time' },
			{ date: '9-Apr-19', close: 3, type: 'practice-time' },
			{ date: '8-Apr-19', close: 5, type: 'practice-time' },
			{ date: '5-Apr-19', close: 1, type: 'practice-time' },
			{ date: '2-Apr-19', close: 4, type: 'practice-time' },
			{ date: '29-Mar-19', close: 2, type: 'practice-time' },
			{ date: '26-Mar-19', close: 6, type: 'practice-time' },
			{ date: '25-Mar-19', close: 0, type: 'practice-time' }
		];

		// format the data
		data.forEach((d) => {
			d.date = parseTime(d.date);
			d.close = +d.close;
		});

		// Scale the range of the data
		x.domain(d3.extent(data, (d) => { return d.date; }));
		y.domain([0, d3.max(data, (d) => { return d.close; })]);

		// Add the valueline path.
		svg.append("path")
			.data([data])
			.attr("class", "line")
			// .attr("color", (d) => { return color[d.type] })
			.attr("d", valueline);
		
		// Add the scatterplot
		svg.selectAll("dot")
			.data(data)
				.enter().append("circle")
					.attr("r", 6)
					.attr("cx", (d) => { return x(d.date); })
					.attr("cy", (d) => { return y(d.close); })
					.attr("class", (d) => { return 'color-' + color[d.type] });

		// Add the X Axis
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));

		// Add the Y Axis
		svg.append("g")
			.call(d3.axisLeft(y));
	}
}