class Router
{
  constructor()
  {
    this.$ =
    {
      links: document.querySelectorAll('a'), // Pense à distinguer les liens internes/externes
      content: document.querySelector('.content'),
    }

    this.datas = 
    {
      documentTitle: document.title
    }

    this.initalResponse = 
    {
      DOM: this.$.content.innerHTML,
      title: this.datas.documentTitle
    }

    //TEMP
    this.ajaxResponse = 
    {
      DOM: "<div>Hello world</div>",
      title: "Project"
    }

    this._listeners()
    this._disabledLinks()
    this._pushState(this.initalResponse, '')
    this._runController('')
  }

  _listeners()
  {
    window.addEventListener('visibilitychange', () => { this._dontLeave() })
    window.addEventListener('popstate', (event) => { this._handlePopState(event) })
  }

  _disabledLinks()
  {
    for(let i = 0; i < this.$.links.length; i++)
    {
      this.$.links[i].addEventListener('click', (event) => { this._handleLinks(event, this.$.links[i]) })
    }
  }

  _handleLinks(_event, _link)
  {
    _event.preventDefault()
  
    const path = _link.getAttribute('href')

    // Launch AJAX request ----> if response run that :
    this._craftAjaxDOM(this.ajaxResponse, path)
  }

  _dontLeave()
  {
    document.title == 'ε(´סּ︵סּ`)з' ? document.title = this.datas.documentTitle : document.title = "ε(´סּ︵סּ`)з"
  }

  _handlePopState(_event)
  {
    if(_event.state)
    {
      document.title = _event.state.documentTitle
      document.querySelector(".content").innerHTML = _event.state.DOM

      // Update links
      this.$.links = document.querySelectorAll('a')
      this._disabledLinks()

      // Run current controller
      this._runController(_event.path[0].location.pathname)
    }
  }

  _craftAjaxDOM(_response, _path)
  {
    // Push response DOM & path
    this._pushState(_response, _path)

    document.title = _response.title
    document.querySelector('.content').innerHTML = _response.DOM

    // Run current controller
    this._runController(_path)
  }

  _pushState(_response, _path)
  {
    window.history.pushState({ DOM: _response.DOM, documentTitle: _response.title },"", _path)
  }

  _runController(_path = '/')
  {
    switch (_path) {
      case '/':
        console.log('run home controller')
        break
      case '/project1':
        console.log('run project1 controller')
        break
      case '/project2':
        console.log('run project2 controller')
        break
      default:
        break;
    }
  }
}

new Router()