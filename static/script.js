$(document).ready(function() {
  $("body").on('click', "div.tabb.active > div.content > div.field > div.button-field > a.btn-save", function() {
      Materialize.toast("Field " + $(this).attr('index') + " Saved", 4000,'',function(){/*alert('Your toast was dismissed')*/})

      field_id = $(this).attr('index')
      tab_id = $("a.waves-effect.active").attr('id')
      name = $("div.tabb.active > div.content > div.field#i"   +  field_id + " > div.input-field > input#name").val()
      text = $("div.tabb.active > div.content > div.field#i"   +  field_id + " > div.input-field > input#text").val()
      count = $("div.tabb.active > div.content > div.field#i"  +  field_id + " > div.input-field > input#paste_count").val()
      action = $("div.tabb.active > div.content > div.field#i" +  field_id + " > input.type").val()
      if (action == "new")
        action = "field_add"
      else if(action == "exist")
        action = "field_update"

      console.log(field_id, tab_id, name, text, count, action)
      $.ajax({
        url: '/',
        type: 'POST',
        data: {
          tab_id: tab_id,
          field_id: field_id,
          name: name,
          text: text,
          count: count,
          action: action
        }
      })

      // $(this).attr('disabled', true)
  })

  $("body").on('click', "div.tabb.active > div.content > div.field > div.button-field > a.btn-remove", function() {
    Materialize.toast("Field " + $(this).attr('index') + " Removed", 4000,'',function(){/*alert('Your toast was dismissed')*/})

    field_id = $(this).attr('index')
    tab_id = $("a.waves-effect.active").attr('id')
    name = $("div.tabb.active > div.content > div.field#i"   +  field_id + " > div.input-field > input#name").val()
    text = $("div.tabb.active > div.content > div.field#i"   +  field_id + " > div.input-field > input#text").val()
    count = $("div.tabb.active > div.content > div.field#i"  +  field_id + " > div.input-field > input#paste_count").val()
    action = $("div.tabb.active > div.content > div.field#i" +  field_id + " > input.type").val()
    if (action == "new") {
      $("div.tabb.active > div.content > div.field#i" + field_id).remove()
    }
    else if(action == "exist") {
      $.ajax({
        url: '/',
        type: 'POST',
        data: {
          tab_id: tab_id,
          field_id: field_id,
          action: "field_remove"
        }
      })
      $("div.tabb.active > div.content > div.field#i" + field_id).remove()
    }

    console.log(field_id, tab_id, name, text, count, action)


    // $(this).attr('disabled', true)
  })

  $('#add').on('click', function() {
    count = $('div.tabb.active > div.content > div.field > p.count')
    console.log(count.length)
    if (count.length == 0) {
      count = 0
    }
    else {
      count = count[count.length - 1].innerText
    }

    $('div.tabb.active > #content').append(`
          <div class="field" id="i` + (parseInt(count) + 1) + `">

            <input type="hidden" class="type" value="new">
            <p class="field-label count">` + (parseInt(count) + 1) + `</p>

            <div class="input-field col s12">
              <input id="name" type="text">
              <label for="password">Name</label>
            </div>

            <div class="input-field col s12">
              <input id="text" type="text">
              <label for="password">Text to paste</label>
            </div>

            <div class="input-field col s12">
              <input id="paste_count" type="number">
              <label for="paste_count">Paste count</label>
            </div>

            <div class="button-field">

              <a class="waves-effect waves-light btn btn-save" index="` + (parseInt(count) + 1) + `">Save</a>
              <a class="waves-effect waves-light btn btn-remove" index="` + (parseInt(count) + 1) + `">Remove</a>

           </div>

          </div>
    `)
  })



  $('body').on("click", "div.tabb.active > div.content > div.field > p.count", function() {
    index = $('p.count').index(this)
    field_id = $(this).text()
    tab_id = $("a.waves-effect.active").attr('id')

    if($($('div.field')[index]).attr('disabled') == 'disabled') {
      $($('div.field')[index]).removeAttr('disabled', false)
      $($('div.field')[index]).find('*').removeAttr('disabled', false);
      $.ajax({
        url: '/',
        type: 'POST',
        data: {
          tab_id: tab_id,
          field_id: field_id,
          action: "field_enable"
        }
      })
    }
    else {
      $($('div.field')[index]).attr('disabled', true)
      $($('div.field')[index]).find('*').attr('disabled', true);
      $.ajax({
        url: '/',
        type: 'POST',
        data: {
          tab_id: tab_id,
          field_id: field_id,
          action: "field_disable"
        }
      })
    }
  })

  $('#check_all').on("click", function () {
    $('div.tabb.active > div.content').find('*').removeAttr('disabled')
  })

  $('#uncheck_all').on("click", function () {
    $('div.tabb.active > div.content').find('*').attr('disabled', true)
  })

  $('#tab_add').on("click", function() {
    tabnum = $('ul.tabs > li.tab')
    tabnum = $(tabnum[tabnum.length - 1]).attr('tabnum')
    $.ajax({
      url: '/',
      type: 'POST',
      data: {
        action: "tab_add"
      },
    success: function(result) {
      console.log("Result", result['tab_id'])

      $('ul.tabs > li.add').before(`
        <li class="tab" tabnum="` + (parseInt(tabnum) + 1) + `"><a href="#tab` + (parseInt(tabnum) + 1) + `" id="` + result['tab_id'] + `" class="waves-effect tab-btn">New Tab</a></li>
      `)

      $('div.card-content').append(`
        <div class="tabb" id="tab` + (parseInt(tabnum) + 1) + `">
          <div class="content" id="content">
          </div>
        </div>
      `)
    }
  })


  })

  $("body").on("click", "div.card-tabs > ul.tabs > li.tab > a.tab-btn", function() {
    // alert($(this).attr('id'))
    $.ajax({
      url: '/',
      type: 'POST',
      data: {
        tab_id: $(this).attr('id'),
        action: "tab_active"
      }
    })
  })
  // $('.field').click(function () {
    // console.log($('.field').index(this))
  // })
})
