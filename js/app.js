(function(){
	class Scroller {
		constructor(selector){
			this.selector = selector;
			this.isOverflow;
			this.isListener1 = false; //check if is listener of forward arrow
			this.isListener2 = false; //check if is listener of back arrow
			
			this.listenToOverflow();
			this.listenToUnderflow();
		}
		
		listenToOverflow(){
			if(!this.isOverflow)
				this.addFlowListener(document.getElementById(this.selector), 'over', ()=>{
					this.isOverflow = true;
					this.handleOverflow();
					this.handleScrollForward();
				})
		}
		
		listenToUnderflow(){
			this.addFlowListener(document.getElementById(this.selector), 'under', ()=>{
				
				this.isOverflow = false;
				this.handleUnderflow();
				
			})
		}
		
		handleOverflow(){
			if(!document.querySelector(`.forward-arrows-${this.selector}`).classList.contains('active-arrow'))
				document.querySelector(`.forward-arrows-${this.selector}`).classList.add('active-arrow');
		}
		
		handleUnderflow(){
			document.querySelector(`.forward-arrows-${this.selector}.active-arrow`).classList.remove('active-arrow');
		}
		
		handleScrollForward(){
			if(!this.isListener1)
				document.querySelector(`.forward-arrows-${this.selector}.active-arrow`).addEventListener('click',(e)=>{
					this.isListener1 = true;
					
					if(this.isOverflow) {
						document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children`)[0].classList.add('hiddenByScroll');
						document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children`)[0].classList.add(`${this.selector}-children-hidden`);
						document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children`)[0].classList.remove(`${this.selector}-children`);
						
						if(!document.querySelector(`.back-arrows-${this.selector}`).classList.contains('active-arrow')) {
							document.querySelector(`.back-arrows-${this.selector}`).classList.add('active-arrow');
							this.handleScrollBack();
						}	
					}
				})
		}
		
		handleScrollBack(){
			if(!this.isListener2)
				document.querySelector(`.back-arrows-${this.selector}.active-arrow`).addEventListener('click',(e)=>{
					this.isListener2 = true;
					
					let hq = document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children-hidden`).length;
					
					if(hq > 0) {
						document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children-hidden`)[hq-1].classList.remove('hiddenByScroll');
						document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children-hidden`)[hq-1].classList.add(`${this.selector}-children`);
						document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children-hidden`)[hq-1].classList.remove(`${this.selector}-children-hidden`);
					}
					
					if(hq === 1)
						document.querySelector(`.back-arrows-${this.selector}.active-arrow`).classList.remove('active-arrow');
					
				})
		}
		
		addFlowListener(element, type, fn){
			let flow = type == 'over';
			 
			element.addEventListener('OverflowEvent' in window ? 'overflowchanged' : type + 'flow', function (e) {
				
				if (e.type == (type + 'flow') ||
				  ((e.orient == 0 && e.horizontalOverflow == flow) || 
				  (e.orient == 1 && e.verticalOverflow == flow) || 
				  (e.orient == 2 && e.horizontalOverflow == flow && e.verticalOverflow == flow))) {
					return fn.call(this, e);
				}
			  }, false);
		}
		
	}
	
	class DevicePopup {
		constructor(selector){
			this.selector = selector;
			
			this.addClickListener();
		}
		
		addClickListener(){
			document.querySelectorAll(`.${this.selector}`).forEach((el) => {
				el.addEventListener('click', function (e) {
					console.log(this)
					console.log(e.target)
					this.classList.add('popup-device-panel');
					document.querySelector('.blur').classList.remove('hidden');
				})
			})
		}
	}
	
	let deviceScroller = new Scroller('devices');
	let scenariosScroller = new Scroller('scenarios');
	let dbScroller = new Scroller('device-block');
	let devicePopup = new DevicePopup('device-panel');
})();