კონსოლში = console.log
window.დაბეჭდე = ->
  არგუმენტები = Array.prototype.slice.apply arguments

  console.log.apply console, არგუმენტები
  $("#console").append არგუმენტები.join ' '
  $("#console").append '\n'

$(document).click ->
  $("#code").hide()
  $(".console").hide()

$("#run").click (e) ->
  $("#code").show()
  $(".console").hide()
  e.stopPropagation()

$("#code").click (e) ->
  e.stopPropagation()

$("#writeCode").keyup ->
  დააკომპილირე()

$(".console > button").click ->
  $(".console").hide()

$("#code > button").click ->
  $(".console").show()
  $("#console").text ''

  ცადე
    eval($("#readCode").text());
  დაიჭირე შეცდომა
    დაბეჭდე დეკოდერი შეცდომა.message

დეკოდერი = (ტექსტი) ->
  რგ = /\\u([\d\w]{4})/gi;
  ტექსტი = ტექსტი.replace რგ, (შედეგი, ჯგუფი) ->
      დააბრუნე String.fromCharCode parseInt ჯგუფი, 16

  ტექსტი

დააკომპილირე_კოდი = (წყარო) ->
  ცადე
    კომპილირებული = ქართულსკრიპტი.დააკომპილირე წყარო, bare: on
    დააბრუნე ჯავასკრიპტი : კომპილირებული
  დაიჭირე შეცდომა
    დააბრუნე შეცდომა : შეცდომა

დააკომპილირე = ->
  წყარო = $("#writeCode").val();
  კოდი  = დააკომპილირე_კოდი წყარო

  $("#readCode").text კოდი.ჯავასკრიპტი თუ კოდი.ჯავასკრიპტი?
  console.log შეცდომა თუ კოდი.შეცდომა?
  დააბრუნე

დააკომპილირე()

$(".qartulskripti-code button").click (e) ->
  კოდი = $(this).parent().find('pre:first code').text()

  $("#writeCode").val კოდი
  $(".console").hide()
  $("#code").show()
  e.stopPropagation()
  დააკომპილირე()
