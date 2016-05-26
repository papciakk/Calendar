$(document).ready(function(){

	var minutes_in_hour = 1440;
	
	var date_show_start = moment();
	var current_week_start_date = date_show_start.subtract(date_show_start.format("e"), 'days');

	var date_range_str = current_week_start_date.format("D") + " - " + 
		current_week_start_date.add(6, 'days').format("D") + " " +
		current_week_start_date.format("MMMM YYYY");
	
	$("#date_range").append(date_range_str);
	
	function calendar(container_class) {
		$("." + container_class).append(
			"<div class='calendar'>" +
			"	<div class='hours_col'></div>" +
			"</div>"
		);
		
		for(var j=0; j<7; j++) {
			addColumn(j);
		}
		
		for(var i=0; i<24; i++) {
			addHoursRow(i);
		}
		
		showAddEventButton();
	}
	
	function addHoursRow(h) {
		var time_str = moment({hour: h}).format("HH:mm");
	
		$(".hours_col").append(
			"<div class='calendar_row hour_row'>" +
			"	<div class='hours_col_inner'>" + time_str + "</div" +
			"</div>"
		);
	}

	function addColumn(n) {
		$(".calendar").append("<div class='calendar_column col" + n + "'></div>");
		
		for(var i=0; i<24; i++) {
			addRow(n);
		}
	}
	
	function addRow(n) {
		$(".calendar_column.col" + n).append(
			"<div class='calendar_row'>" +
			"	<div class='calendar_halfanhour'></div>" +
			"</div>"
		);
	}
	
	// ********************************************************
	
	function showAddEventButton() {
		$(".calendar").append(
			"<button class='add_event_btn' data-toggle='modal' data-target='#event_modal' data-id='-1'>+</button>"
		);
	}
	
	// ********************************************************
	
	function event(id, date_start, date_end, text, description, color) {
	
		var time_str = date_start.format("HH:mm") + "-" + date_end.format("HH:mm");
		var day_of_week = date_start.format("e");
		
		var duration_percent = moment.duration(date_end.diff(date_start)).asMinutes() / minutes_in_hour * 100;
		var start_percent = moment.duration(date_start.format("HH:mm")).asMinutes() / minutes_in_hour * 100;				
	
		$(".calendar_column.col" + day_of_week).append(
			"<div id='event" + id + "' class='event ev_col" + color +"' style='top:" + start_percent + "%; height:" + duration_percent + "%' data-toggle='modal' data-target='#event_modal' data-id='" + id + "'>" +
			"	<div style='margin:4px; overflow:hidden;'>" +
			"		<div class='event_time ev_col" + color + "'>" + time_str + "</div>" +
			"		<span class='event_text'>" + text + "</span>" +
			"	</div>" +
			"</div>"
		);
		
		$("#event" + id).click(function() {
			$("#event" + id).popover();
		});
		
	}
	
	// ********************************************************
	
	function initTimeCursor() {
		var day_of_week = moment().format("e");
		
		$(".calendar_column.col" + day_of_week).append(
			"<div class='time_cursor'></div>"
		);
		
		$(".calendar_column.col" + day_of_week).css('background-color', '#F7F7F7');
		
		updateCursorPosition();
		setInterval(updateCursorPosition, 60000);
	}
	
	function updateCursorPosition() {
		var cursor_pos = moment.duration(moment().format("HH:mm")).asMinutes() / minutes_in_hour * 100;
		$(".time_cursor").css("top", String(cursor_pos) + "%");
		
	}
	
	// ********************************************************
	
	function initModalEvent() {				
		$('#event_modal').on('show.bs.modal', function (event) {
			var button = $(event.relatedTarget);
			var id = button.data('id');

			var modal = $(this);
			modal.find('#event_edit_id').val(id);
		});
	}
	
	function showColorBoxes() {
		for(var i=0; i<9; i++) {
			$("#event_edit_color").append(
				"<label>" +
				"	<input type='radio' name='options' style='margin-right:10px;' id='ev_col" + i + "' autocomplete='off'>" +
				"	<div style='margin-top:2px;' class='color_box ev_col" + i + "'></div>" +
				"</label>"
			);
		}
		
		$("#ev_col0").attr("checked", "checked");
	}
	
	function initModalInputs() {
		$('#event_edit_date_picker').datetimepicker({
			locale: 'pl',
			format: 'YYYY-MM-DD',
			defaultDate: moment()
		});
		
		$('#event_edit_start_time_picker').datetimepicker({
			locale: 'pl',
			format: 'HH:mm',
			defaultDate: moment().set('minutes', 0)
		});
		
		$('#event_edit_end_time_picker').datetimepicker({
			locale: 'pl',
			format: 'HH:mm',
			defaultDate: moment().set('minutes', 0).add(1, 'hour').add(30, 'minutes')
		});
		
		$('#date_range_start_picker').datetimepicker({
			locale: 'pl',
			format: 'YYYY-MM-DD',
			defaultDate: moment(),
			inline:true
		});
	}
	
	// ********************************************************
	
	function init() {
		initTimeCursor();
		initModalEvent();
		showColorBoxes();
		initModalInputs();
	}
	
	calendar("calendar_container");
	event(1, moment("2016-05-07 13:30"), moment("2016-05-07 15:00"), "To jest przykładowy tytuł", "Ala ma kota", 8);
	event(2, moment("2016-02-10 08:30"), moment("2016-02-10 09:00"), "To jest przykładowy tytuł", "Ala ma kota", 2);
	event(3, moment("2016-02-11 09:00"), moment("2016-02-11 10:00"), "To jest przykładowy tytuł", "Ala ma kota", 7);
	
	init();
});