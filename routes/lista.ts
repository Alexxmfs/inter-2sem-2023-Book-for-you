import app = require("teem");

class LivroRoute {
    public async listarLivro(req: app.Request, res: app.Response) {
		let livros: any[];

		await app.sql.connect(async (sql: app.Sql) => {
            livros = await sql.query("SELECT idLivro, titulo, descricao, autor, editora, categoria, ano FROM livro;");
        });

		res.render("index/listar", {
			livros: livros
		});
	};
}

export = LivroRoute;