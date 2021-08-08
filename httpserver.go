package main

import (
	"fmt"
	"html/template"
	"net/http"
)

var templates map[string]*template.Template

func init() {
	if templates == nil {
		templates = make(map[string]*template.Template)
	}

	templates["login.html"] = template.Must(template.ParseFiles("html/login.html"))
	//templates["fileindex.html"] = template.Must(template.ParseFiles("html/fileindex.html"))
	templates["userindex.html"] = template.Must(template.ParseFiles("html/userindex.html"))
	templates["chatindex.html"] = template.Must(template.ParseFiles("html/chatindex.html"))
	templates["ifrmindex.html"] = template.Must(template.ParseFiles("html/ifrmindex.html"))
}

func main() {
	var mux = http.NewServeMux()
	const httpSeverPortNo string = ":80"
	fs := http.FileServer(http.Dir("html"))
	mux.Handle("/html/", http.StripPrefix("/html", fs))
	registerRoutes(mux)

	httpServer := http.Server{
		Addr:    httpSeverPortNo,
		Handler: mux,
	}

	err := httpServer.ListenAndServe()
	if err != nil {
		fmt.Print(err)
	}
}
