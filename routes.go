package main

import "net/http"

func registerRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/", login)
	mux.HandleFunc("/register", registerUser)
	mux.HandleFunc("/ifrm", ifrmindex)
	mux.HandleFunc("/user", userindex)
	mux.HandleFunc("/chat", chatindex)
	mux.HandleFunc("/scheduler", schedulerindex)
	mux.HandleFunc("/mainview", mainview)
	mux.HandleFunc("/*", login)
}
