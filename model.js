window.tffo = {
	START: 'start',
	QUESTION: 'question',
	RIGHT: 'right',
	WRONG: 'wrong',
	GAME_OVER: 'game_over'
};

$(document).ready(function() {
	var Question = function(question, answer) {
		this.question = question;
		this.answer = answer;
	};

	var Answer = function(vm, typeface) {
		this.vm = vm;
		this.typeface = typeface;

		this.click = function() {
			this.vm.answerClicked(this);
		};
	};

	var ViewModel = function() {
		this.typefaces = ['Arial', 'Verdana'];
		this.score = ko.observable();
		this.lives = ko.observable();
		this.state = ko.observable(tffo.START);
		this.question = ko.observable(new Question("", new Answer()));
		var vm = this;
		this.answers = $.map(this.typefaces, function(typeface) { return new Answer(vm, typeface); });

		this.newGame = function() {
			this.lives(3);
			this.score(0);
			this.nextQuestion();
		};

		this.answerClicked = function(answer) {
			if (this.question().answer == answer) {
				this.score(this.score() + 100);
				this.state(tffo.RIGHT);
			} else {
				this.lives(this.lives() - 1);
				if (this.lives()) {
					this.state(tffo.WRONG);
				} else {
					this.state(tffo.GAME_OVER);
				}
			}
		};

		this.nextQuestion = function() {
			var answer = this.randomAnswer();
			this.question(new Question('Test', answer));
			this.state(tffo.QUESTION);
		};

		this.randomAnswer = function() {
			var i = Math.floor(Math.random() * this.answers.length);
			return this.answers[i];
		};

		this.home = function() {
			this.state(tffo.START);
		};
	};

	ko.applyBindings(new ViewModel());
});
