import app = require("teem");

class LivroRoute {
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

            await sql.query("UPDATE livro SET titulo = ?, descricao = ?, autor = ?, editora = ?, categoria = ?, ano = ? WHERE idLivro = ?", 
                [livroAtualizado.titulo, livroAtualizado.descricao, livroAtualizado.autor, livroAtualizado.editora, livroAtualizado.categoria, livroAtualizado.ano, idLivro]);

            const livroAtualizadoNoBanco = await sql.query("SELECT * FROM livro WHERE idLivro = ?", [idLivro]);

            if (livroAtualizadoNoBanco) {
                res.json(livroAtualizadoNoBanco);
            } else {
                res.status(500).json("Falha ao atualizar o livro");
            }
        });
    }
}

export = LivroRoute;


