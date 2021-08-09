package main

import (
	"fmt"
	"html/template"
	"net/http"
)

func login(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("html/login.html")
	if err != nil {
		fmt.Print(err)
	}
	err = tmpl.Execute(w, nil)
	if err != nil {
		fmt.Print(err)
	}
}

func ifrmindex(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("html/ifrmindex.html")
	if err != nil {
		fmt.Print(err)
	}
	err = tmpl.Execute(w, nil)
	if err != nil {
		fmt.Print(err)
	}
}

func userindex(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("html/userindex.html")
	if err != nil {
		fmt.Print(err)
	}
	err = tmpl.Execute(w, nil)
	if err != nil {
		fmt.Print(err)
	}
}

func chatindex(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("html/chatindex.html")
	if err != nil {
		fmt.Print(err)
	}
	err = tmpl.Execute(w, nil)
	if err != nil {
		fmt.Print(err)
	}
}

func schedulerindex(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("html/schedulerindex.html")
	if err != nil {
		fmt.Print(err)
	}
	err = tmpl.Execute(w, nil)
	if err != nil {
		fmt.Print(err)
	}
}

func registerUser(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("html/registerUser.html")
	if err != nil {
		fmt.Print(err)
	}
	err = tmpl.Execute(w, nil)
	if err != nil {
		fmt.Print(err)
	}
}

func mainview(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("html/mainview.html")
	if err != nil {
		fmt.Print(err)
	}
	err = tmpl.Execute(w, nil)
	if err != nil {
		fmt.Print(err)
	}
}
