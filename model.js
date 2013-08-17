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

	var Answer = function(vm, name) {
		this.vm = vm;
		this.name = name;

		this.click = function() {
			this.vm.answerClicked(this);
		};
	};

	var ViewModel = function() {
		this.score = ko.observable();
		this.lives = ko.observable();
		this.state = ko.observable(tffo.START);
		this.question = ko.observable(new Question());
		this.answers = [
			new Answer(this, 'A1'),
			new Answer(this, 'A2')
		];

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
			this.question(new Question('test', this.answers[0]));
			this.state(tffo.QUESTION);
		};

		this.home = function() {
			this.state(tffo.START);
		};
	};

	ko.applyBindings(new ViewModel());
});
