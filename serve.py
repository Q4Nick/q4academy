#!/usr/bin/env python3
"""Dev server voor de e-learning: serveert de map E-learning zonder caching,
zodat de Replit preview altijd de nieuwste versie laat zien."""
import http.server
import os

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), "E-learning"))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    http.server.ThreadingHTTPServer(("0.0.0.0", 5000), NoCacheHandler).serve_forever()
