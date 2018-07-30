(function(){	
	class Scroller {
		constructor(selector, rows, blockWidth, margin){
			this.selector = selector;
			this.blockWidth = blockWidth;
			this.rows = rows;
			this.margin = margin;
			this.isOverflow;
			this.isListenerForward = false; //check if is listener of forward arrow
			this.isListenerBack = false; //check if is listener of back arrow
			
			this.listenToScreenChange();
			this.listenToOverflow();
		}
		
		listenToOverflow(){
			let totalWidth = document.getElementById(this.selector).offsetWidth;
			let children = document.querySelectorAll(`.${this.selector}-children`);
			
			let sum = 0;
			
			children.forEach(child => {
				if(child.offsetWidth > 0)
					sum += child.offsetWidth + this.margin;
			})
			
			this.isOverflow = (totalWidth < (sum / this.rows))
		
			if (totalWidth < (sum / this.rows)) {
				this.handleOverflow();
				this.handleScrollForward();
			} else {
				this.handleUnderflow();
			}	
		}
		
		listenToScreenChange(){
			window.addEventListener('resize', (e) => {
				this.listenToOverflow();
			});
		}
				
		handleOverflow(){
			try{
				if(!document.querySelector(`.forward-arrows-${this.selector}`).classList.contains('active-arrow'))
					document.querySelector(`.forward-arrows-${this.selector}`).classList.add('active-arrow');
			} catch(e){
				console.log(e);
			}
		}
		
		handleUnderflow(){
			try{
				document.querySelector(`.forward-arrows-${this.selector}.active-arrow`).classList.remove('active-arrow');
			} catch(e){
				console.log(e);
			}
		}
		
		handleScrollForward(){
			if(!this.isListenerForward) //add listener once
				document.querySelector(`.forward-arrows-${this.selector}.active-arrow`).addEventListener('click',(e)=>{
					this.isListenerForward = true;
					this.listenToOverflow();
					
					if(this.isOverflow) {
						let element = document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children`)[0];
						element.classList.add('hiddenByScroll');
						setTimeout(()=>{
							element.classList.add(`${this.selector}-children-hidden`);
							element.classList.add(`hidden`);
							element.classList.remove(`${this.selector}-children`);
						}, 100);
						
						if(!document.querySelector(`.back-arrows-${this.selector}`).classList.contains('active-arrow')) {
							document.querySelector(`.back-arrows-${this.selector}`).classList.add('active-arrow');
							this.handleScrollBack();
						}	
					}
				})
		}
		
		handleScrollBack(){
			if(!this.isListenerBack) //add listener once
				document.querySelector(`.back-arrows-${this.selector}.active-arrow`).addEventListener('click',(e)=>{
					this.isListenerBack = true;
					this.listenToOverflow();
					
					let hq = document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children-hidden`).length;
					
					if(hq > 0) {
						let element = document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children-hidden`)[hq-1];
						element.classList.remove('hiddenByScroll');
						element.classList.remove('hidden');
						element.classList.add(`${this.selector}-children`);
						element.classList.remove(`${this.selector}-children-hidden`);
					}
					
					if(hq === 1)
						document.querySelector(`.back-arrows-${this.selector}.active-arrow`).classList.remove('active-arrow');
					
				})
		}
		
	}
		
	class DevicePopup {
		constructor(selector){
			this.selector = selector;
			
			this.addClickListener();
			this.addCloseListener();
		}
		
		addClickListener(){
			let listener = function(e) {
					if(!e.target.classList.contains('controlButton')) {
						this.classList.add('popup-device-panel');
						this.getElementsByClassName('smallview')[0].classList.add('hidden');
						this.getElementsByClassName('popupview')[0].classList.remove('hidden');
						document.querySelector('.blur').classList.remove('hidden');
						e.target.removeEventListener('click', listener, false);
					}
			}
			
			
			document.querySelectorAll(`.${this.selector}`).forEach((el) => {
				if(!el.classList.contains('hasPopupListener'))
					el.addEventListener('click', listener, false);
				el.classList.add('hasPopupListener');
			})
		}
		
		addCloseListener() {
			document.querySelectorAll(`.controlButton`).forEach(el => {
				el.addEventListener('click', function (e) {
					document.querySelector('.blur').classList.add('hidden');
					this.parentElement.parentElement.classList.add('hidden');
					this.parentElement.parentElement.previousElementSibling.classList.remove('hidden');
					this.parentElement.parentElement.parentElement.classList.remove('popup-device-panel');
				})
			})
		}
	}
	
	class InfiniteScroller {
		constructor(selector, styleClass){
			this.selector = selector;
			this.styleClass = styleClass;
			this.length;
			
			this.addClickListener();
			this.setLength();
		}
		
		addClickListener(){
			document.querySelector(`.infinite-arrow-${this.selector}`).addEventListener('click', this.handleScroll.bind(this));
		}
		
		setLength(){
			this.length = document.getElementById(this.selector).getElementsByClassName(`${this.selector}-children`).length;
		}
		
		handleScroll(){
			let parentNode =  document.getElementById(this.selector);
			let children = parentNode.getElementsByClassName(`${this.selector}-children`);
			let scrollBlock = children[0];
			let highPanel = '';
			if (scrollBlock.classList.contains('high-panel')) //check if removed block is high-panel popup block
				highPanel = 'high-panel';
			let scrollBlockHTML = scrollBlock.innerHTML;
			let newBlock = document.createElement('div');
			newBlock.className = `${this.selector}-children ${this.styleClass} ${highPanel}`;
			let oldBlock = parentNode.getElementsByClassName(`${this.selector}-children`)[0];
			oldBlock.parentNode.removeChild(oldBlock);
			parentNode.appendChild(newBlock);
			parentNode.getElementsByClassName(`${this.selector}-children`)[this.length - 1].innerHTML =  scrollBlockHTML;
			let newPopup = new DevicePopup('device-panel');
		}
		
	}
	
	class NavbarCollapser {
		constructor(selector,  menuSelector, navbarSelector){
			this.selector = selector;
			this.navbarSelector = navbarSelector;
			this.menuSelector = menuSelector;
			
			this.listenToMenu();
		}
		
		listenToMenu(){
			document.querySelector(`.${this.selector}`).addEventListener('click', this.handleMenuShowing.bind(this));
		}
		
		handleMenuShowing(){
			document.querySelector(`#${this.menuSelector}`).classList.toggle('hidden-mobile');
			document.querySelector(`.${this.navbarSelector}`).classList.toggle('opened-menu');
		}
	}
	
	class DeviceLinkToggler {
		constructor(selector){
			this.selector = selector;
			this.state = {opened:false}
			
			this.listenToClick();
		}
				
		listenToClick(){
			let links = document.getElementsByClassName(this.selector);
			for (let el of links) {
				try{
					el.addEventListener('click', this.handleClick.bind(this));
				} catch(e) {
					console.log(e)
				}
			}
		}
		
		handleClick(e) {
			let links = document.getElementsByClassName(`${this.selector}`);
			
			if (!window.matchMedia("(max-width: 978px)").matches)
				this.state.opened = true;	
			
			if(!this.state.opened) {
				this.state.opened = true;
				
				for (let el of links) {
					try{
						el.parentElement.classList.remove('hiddenDevicelink');
					} catch(e) {
						console.log(e)
					}
				}
				
			} else {
				this.state.opened = false;
				document.querySelector('.chosenDeviceLink').classList.remove('chosenDeviceLink');
				e.target.classList.add('chosenDeviceLink');
				
				for (let el of links) {
					try{
						if(!el.classList.contains('chosenDeviceLink'))
							el.parentElement.classList.add('hiddenDevicelink');
						else 
							el.parentElement.classList.remove('hiddenDevicelink');
					} catch(e) {
						console.log(e)
					}
				}
				
			}
		}
	}
	
	let deviceScroller = new Scroller('devices', 1, 200, 15);
	let scenariosScroller = new Scroller('scenarios', 3, 200, 15);
	let deiceBlockScroller = new InfiniteScroller('device-block', 'device-panel');
	let devicePopup = new DevicePopup('device-panel');
	let navbarCollapser = new NavbarCollapser('home-navbar-button', 'menu-mobile', 'home-navbar');
	let deviceLinkToggler = new DeviceLinkToggler('devicecategory')
})();