import { Router, type IRouter } from "express";
import { eq, ilike, and, type SQL } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import { ListBlogPostsQueryParams, GetBlogPostParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/blog", async (req, res): Promise<void> => {
  const parsed = ListBlogPostsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { category, search } = parsed.data;
  const conditions: SQL[] = [];
  if (category) conditions.push(eq(blogPostsTable.category, category));
  if (search) conditions.push(ilike(blogPostsTable.title, `%${search}%`));

  const posts = conditions.length
    ? await db.select().from(blogPostsTable).where(and(...conditions))
    : await db.select().from(blogPostsTable);
  res.json(posts);
});

router.get("/blog/:id", async (req, res): Promise<void> => {
  const params = GetBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, params.data.id));
  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json(post);
});

export default router;
