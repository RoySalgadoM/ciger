<?php

namespace App\Controller;

use App\Entity\Cast;
use DateTime;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
header('Access-Control-Allow-Origin: *');

class CastController extends AbstractController
{
    public function findAll()
    {
        $em = $this->getDoctrine()->getManager();
        $query = $em -> createQuery('SELECT c.idcast, c.name, c.role, c.biographyurl, c.dateCreated, c.dateUpdated, c.status FROM App:Cast c');
        $list = $query -> getResult();
        $data = [
            'status'=> 404,
            'message'=>'No results found'
        ];
        if(count($list) > 0){
            $data = [
                'status'=> 200,
                'message'=>'The cast has been successfully retrieved',
                'cast' => $list
            ];
        }
        return new JsonResponse($data);
    }
    public function findCastById($id){
        $em = $this->getDoctrine()->getManager();
        $query = $em -> createQuery('SELECT c.idcast, c.name, c.role, c.biographyurl, c.dateCreated, c.dateUpdated, c.status FROM App:Cast c WHERE c.idcast=:p');
        $query->setParameter(':p',$id);
        $cast = $query->getResult();
        $data = [
            'status'=> 404,
            'message'=>'No results found'
        ];
        if(count($cast) > 0){
            $data = [
                'status'=> 200,
                'message'=>'The cast has been successfully retrieved',
                'cast' => $cast
            ];
        }
        return new JsonResponse($data);
    }
    public function createCast(Request $request){
        $em = $this->getDoctrine()->getManager();

        $name = $request->get('name',null);
        $role = $request->get('role',null);
        $biographyURL = $request->get('biographyURL',null);
        $dataTime = new DateTime('NOW');

        $cast = new \App\Entity\Cast();
        $cast->setName($name);
        $cast->setRole($role);
        $cast->setBiographyurl($biographyURL);
        $cast->setDateCreated($dataTime);
        $cast->setDateUpdated($dataTime);
        $cast->setStatus(1);

        $em -> merge($cast);
        $em ->flush();
        $data = [
            'status'=> 200,
            'message'=>'The cast has been successfully created'
        ];
        return new JsonResponse($data);
    }
    public function updateCast(Request $request){
        $em = $this->getDoctrine()->getManager();

        $name = $request->get('name',null);
        $role = $request->get('role',null);
        $biographyURL = $request->get('biographyURL',null);
        $id = $request->get('id',null);
        $dateTime = new DateTime('NOW');

        $query = $em -> createQuery('UPDATE App:Cast c SET c.name = :name, c.role = :role, c.biographyurl = :biographyurl, c.dateUpdated = :dateUpdated  WHERE c.idcast=:p');
        $query->setParameter(':name',$name);
        $query->setParameter(':role',$role);
        $query->setParameter(':biographyurl',$biographyURL);

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
    public function deleteCast($id){
        $em = $this->getDoctrine()->getManager();
        $query = $em -> createQuery('UPDATE App:Cast c SET c.status = 0 WHERE c.idcast =:p');
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
