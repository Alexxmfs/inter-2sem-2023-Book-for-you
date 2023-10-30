import app = require("teem");

class LivroRoute {
	public async cadastroLivro(req: app.Request, res: app.Response) {
		res.render("index/cadastroLivro");
	}

	public async edicaoLivro(req: app.Request, res: app.Response) {
		let livro: any = null;

        let idLivro = parseInt(req.query.idLivro as string);

        if (isNaN(idLivro)) {
            res.status(400).json("Id inválido");
            return;
        }

        await app.sql.connect(async (sql: app.Sql) => {
            const lista: any[] = await sql.query("SELECT idLivro, titulo, descricao, autor, categoria, ano FROM livro WHERE idLivro = ?", [idLivro]);
            livro = lista[0];
        });

        console.log(livro);
        res.json(livro);

        if (!livro) {
            res.status(400).json("Livro não encontrado");
            return;
        }

        res.render("index/edicaoLivro", {
            livro: livro
        });
	}

	public async livroDetalhe(req: app.Request, res: app.Response) {
		let livros: any = null;

        let idLivro = parseInt(req.query.idLivro as string);

        if (isNaN(idLivro)) {
            res.status(400).json("Id inválido");
            return;
        }

        await app.sql.connect(async (sql: app.Sql) => {
            const lista: any[] = await sql.query("SELECT idLivro, titulo, descricao, autor, categoria, ano FROM livro WHERE idLivro = ?", [idLivro]);
            livros = lista[0];
        });

        if (!livros) {
            res.status(400).json("Livro não encontrado");
            return;
        }

        res.render("index/livroDetalhe", {
            livros: livros
        });
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

            await sql.query("INSERT INTO livro (titulo, descricao, autor, categoria, ano) VALUES (?, ?, ?, ?, ?)", [livros.titulo, livros.descricao, livros.autor, livros.categoria, livros.ano]);

            let idLivro = await sql.scalar("SELECT last_insert_id()");

            app.fileSystem.saveUploadedFile("/public/img/livros/" + idLivro + ".jpg", imagem);

            await sql.commit();
        });

        res.json(true);
    }

    @app.http.put()
    public async editar(req: app.Request, res: app.Response) {
        const idLivro: number = parseInt(req.params["idLivro"]);
        const livroAtualizado = req.body;

        await app.sql.connect(async (sql: app.Sql) => {
            const livroExistente = await sql.query("SELECT * FROM livro WHERE idLivro = ?", [idLivro]);

            if (!livroExistente) {
                res.status(404).json("Livro não encontrado");
                return;
            }

            await sql.query("UPDATE livro SET titulo = ?, descricao = ?, autor = ?, categoria = ?, ano = ? WHERE idLivro = ?", 
                [livroAtualizado.titulo, livroAtualizado.descricao, livroAtualizado.autor, livroAtualizado.categoria, livroAtualizado.ano, idLivro]);

            const livroAtualizadoNoBanco = await sql.query("SELECT * FROM livro WHERE idLivro = ?", [idLivro]);

            if (livroAtualizadoNoBanco) {
                res.json(livroAtualizadoNoBanco);
            } else {
                res.status(500).json("Falha ao atualizar o livro");
            }
        });
    }

    public async listarLivro(req: app.Request, res: app.Response) {
		let livros: any[];

		await app.sql.connect(async (sql: app.Sql) => {
            livros = await sql.query("SELECT idLivro, titulo, descricao, autor, categoria, ano FROM livro;");
        });

		res.render("index/listar", {
			livros: livros
		});
	};
}

export = LivroRoute;
