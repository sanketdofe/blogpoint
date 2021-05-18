import client from '../models/dbConnection.js';

/////////////////////////////Controllers////////////////////////////////

////////////////////////Add Blog////////////////////////
export const addBlog = (req, res) => {
  if (Object.keys(req.body).length === 0){
    res.status(200).send({message: 'Pass all blog field in body'});
    return;
  }
  else{
    for (var item of [req.body.title, req.body.type, req.body.description, req.body.body, req.body.image]){
      // console.log(item);
      if(item === undefined || item === null){
        res.status(200).send({message: 'Some fields are missing. Pass all blog field in body'});
        return;
      }
    }
  }
  client.query("SELECT userid, title from public.blog WHERE title=$1 AND isdeleted=false", [req.body.title])
  .then(result => {
    if(result.rows.length !== 0){
      res.status(200).send({message: "A blog with same title already exists"});
    }
    else{
      client.query("INSERT INTO public.blog(userid, title, type, description, body, image, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())", [res.locals.userid, req.body.title, req.body.type, req.body.description, req.body.body, req.body.image])
      .then(result => {
        // console.log(result);
        res.status(201).send({message: "Blog added successfully"})
      })
      .catch(error => {console.log(error)});
    }
  })
  .catch(error => {console.log(error)});
}


///////////////////////////Get All Blogs//////////////////////////
export const getAllBlogs = (req, res) => {
  client.query("SELECT b.*, u.name AS authorname from public.blog b, public.user u WHERE b.userid=u.userid AND b.isdeleted=false")
  .then(result => {
    // console.log(result.rows);
    if(result.rows.length === 0){
      res.status(200).send({message: "No blogs found"});
    }
    else{
      res.status(200).send({message: `${result.rows.length} blogs found`, results: result.rows});
    }
  })
  .catch(error => {
    console.log(error);
  });
}


////////////////////Get Blogs of Particular Type///////////////////
export const getBlogsWithType = (req, res) => {
  // console.log(req);
  if(req.params.type === 'All'){
    res.status(307).redirect("/api/blog/getallblogs");
  }
  else{
    client.query("SELECT b.*, u.name AS authorname from public.blog b, public.user u WHERE b.userid=u.userid AND b.type=$1 AND b.isdeleted=false", [req.params.type])
    .then(result => {
      // console.log(result.rows);
      if(result.rows.length === 0){
        res.status(200).send({message: "No blogs found for this type"});
      }
      else{
        res.status(200).send({message: `${result.rows.length} blogs found for this type`, results: result.rows});
      }
    })
    .catch(error => {
      console.log(error);
    });
  }
}


/////////////////////////Get User Blogs///////////////////////////
export const getUserBlogs = (req, res) => {
  client.query("SELECT b.*, u.name AS authorname FROM public.blog b, public.user u WHERE b.userid=$1 AND u.userid=$1 AND b.isdeleted=false", [res.locals.userid])
  .then(result => {
    // console.log(result);
    if(result.rows.length === 0){
      res.status(200).send({message: "No blogs found"});
    }
    else{
      res.status(200).send({message: `${result.rows.length} blogs found`, results: result.rows});
    }
  })
  .catch(error => {
    console.log(error);
  });
}


//////////////////////////Update Blog/////////////////////////////
export const updateBlog = (req, res) => {
  if(req.body.blogid === undefined || req.body.blogid === null){
    res.status(200).send({message: 'Provide the blogid of the blog to be updated'});
    return;
  }
  else {
    for (var item of [req.body.title, req.body.type, req.body.description, req.body.body, req.body.image]){
      // console.log(item);
      if(item === undefined || item === null){
        res.status(200).send({message: 'Some fields are missing. Pass all blog field in body'});
        return;
      }
    }
  }
  client.query("UPDATE public.blog SET title=$1, type=$2, description=$3, body=$4, image=$5, updated_at=NOW() WHERE blogid=$6", [req.body.title, req.body.type, req.body.description, req.body.body, req.body.image, req.body.blogid])
  .then(result => {
    res.status(200).send({message: "Blog updated successfully"});
  })
  .catch(error => {console.log(error)});
}


//////////////////////////Soft Delete Blog/////////////////////////
export const softDeleteBlog = (req, res) => {
  if(req.body.blogid === undefined || req.body.blogid === null){
    res.status(200).send({message: 'Provide the blogid of the blog to be soft deleted'});
    return;
  }
  if(res.locals.role !== 'admin'){
    res.status(200).send({message: 'Unauthorized: Requires role as admin'});
  }
  else{
    client.query("UPDATE public.blog SET isdeleted=true, deleted_at=NOW() WHERE blogid=$1", [req.body.blogid])
    .then(r => {
      if(r.rowCount === 0){
        res.status(200).send({message: "Blog with given blogid not found (Already deleted)"})
      }else{
        res.status(200).send({message: "Soft deletion successful"});
      }
    })
    .catch(error => {console.log(error)});
  }
}


////////////////////////Hard Delete Blog/////////////////////////
export const hardDeleteBlog = (req, res) => {
  if(req.body.blogid === undefined || req.body.blogid === null){
    res.status(200).send({message: 'Provide the blogid of the blog to be hard deleted'});
    return;
  }
  if(res.locals.role !== 'admin'){
    res.status(200).send({message: 'Unauthorized: Requires role as admin'});
  }
  else{
    client.query("DELETE FROM public.blog WHERE blogid=$1", [req.body.blogid])
    .then(r => {
      if(r.rowCount === 0){
        res.status(200).send({message: "Blog with given blogid not found (Already deleted)"})
      }else{
        res.status(200).send({message: "Hard deletion successful"});
      }
    })
    .catch(error => {console.log(error)});
  }
}