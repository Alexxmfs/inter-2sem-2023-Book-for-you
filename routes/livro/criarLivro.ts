import app = require("teem");

class LivroRoute {

	public async cadastroLivro(req: app.Request, res: app.Response) {
		res.render("index/cadastroLivro");
	}

	@app.http.post()
    @app.route.formData()
    public async criar(req: app.Request, res: app.Response) {
        let livros = req.body;
	  
		let imagem = req.uploadedFiles["imagem"];
		if (!imagem) {
            res.status(400).json("Imagem inválida");
			return;
		}

		await app.sql.connect(async (sql: app.Sql) => {
            await sql.beginTransaction();

            await sql.query("INSERT INTO livro (titulo, descricao, autor, editora, categoria, ano) VALUES (?, ?, ?, ?, ?, ?)", [livros.titulo, livros.descricao, livros.autor, livros.editora, livros.categoria, livros.ano]);

            let idLivro = await sql.scalar("SELECT last_insert_id()");

            app.fileSystem.saveUploadedFile("/public/img/livros/" + idLivro + ".jpg", imagem);

            await sql.commit();
        });

        res.json(true);
    }
}

export = LivroRoute;
