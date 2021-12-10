<?php

namespace App\Controller;

use App\Entity\Category;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
header('Access-Control-Allow-Origin: *');
class CategoryController extends AbstractController
{
    public function findAll()
    {
        $em = $this->getDoctrine()->getManager();
        $query = $em -> createQuery('SELECT c.idcategory, c.name, c.dateCreated, c.dateUpdated, c.status FROM App:Category c');
        $list = $query -> getResult();
        $data = [
            'status'=> 404,
            'message'=>'No results found'
        ];
        if(count($list) > 0){
            $data = [
                'status'=> 200,
                'message'=>'The category has been successfully retrieved',
                'category' => $list
            ];
        }
        return new JsonResponse($data);
    }
    public function findCategoryById($id){
        $em = $this->getDoctrine()->getManager();
        $query = $em -> createQuery('SELECT c.idcategory, c.name, c.dateCreated, c.dateUpdated, c.status FROM App:Category c WHERE c.idcategory=:p');
        $query->setParameter(':p',$id);
        $category = $query->getResult();
        $data = [
            'status'=> 404,
            'message'=>'No results found'
        ];
        if(count($category) > 0){
            $data = [
                'status'=> 200,
                'message'=>'The category has been successfully retrieved',
                'category' => $category
            ];
        }
        return new JsonResponse($data);
    }
    public function createCategory(Request $request){
        $em = $this->getDoctrine()->getManager();

        $name = $request->get('name',null);
        $dataTime = new DateTime('NOW');

        $category = new \App\Entity\Category();
        $category->setName($name);
        $category->setDateCreated($dataTime);
        $category->setDateUpdated($dataTime);
        $category->setStatus(1);

        $em -> merge($category);
        $em ->flush();
        $data = [
            'status'=> 200,
            'message'=>'The category has been successfully created'
        ];
        return new JsonResponse($data);
    }
    public function updateCategory(Request $request){
        $em = $this->getDoctrine()->getManager();

        $name = $request->get('name',null);
        $id = $request->get('id',null);
        $dateTime = new DateTime('NOW');

        $query = $em -> createQuery('UPDATE App:Category c SET c.name = :name, c.dateUpdated = :dateUpdated  WHERE c.idcategory=:p');
        $query->setParameter(':name',$name);

        $query->setParameter(':dateUpdated',$dateTime);
        $query->setParameter(':p',$id);
        $flag = $query->getResult();

        if($flag ==1){
            $data = [
                'status'=> 200,
                'message'=>'Has been successfully modified'
            ];
        }else{
            $data = [
                'status'=> 404,
                'message'=>'It has not been modified correctly'
            ];
        }
        return new JsonResponse($data);
    }
    public function deleteCategory($id){
        $em = $this->getDoctrine()->getManager();
        $query = $em -> createQuery('UPDATE App:Category c SET c.status = 0 WHERE c.idcategory =:p');
        $query->setParameter(':p',$id);
        $flag = $query->getResult();
        if($flag==1){
            $data = [
                'status'=> 200,
                'message'=>'Has been successfully deactivated'
            ];
        }else{
            $data = [
                'status'=> 200,
                'message'=>'It has not been deactivated correctly'
            ];
        }
        return new JsonResponse($data);
    }
}
