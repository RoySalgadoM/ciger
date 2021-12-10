<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Movie
 *
 * @ORM\Table(name="movie", indexes={@ORM\Index(name="fk_MOVIE_CATEGORY1_idx", columns={"id_category"})})
 * @ORM\Entity
 */
class Movie
{
    /**
     * @var int
     *
     * @ORM\Column(name="idMovie", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $idmovie;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=45, nullable=false)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="originalTitle", type="string", length=45, nullable=false)
     */
    private $originaltitle;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=45, nullable=false)
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="runningTime", type="string", length=45, nullable=false)
     */
    private $runningtime;

    /**
     * @var string
     *
     * @ORM\Column(name="imgURL", type="string", length=45, nullable=false)
     */
    private $imgurl;

    /**
     * @var string
     *
     * @ORM\Column(name="price", type="decimal", precision=10, scale=0, nullable=false)
     */
    private $price;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_created", type="datetime", nullable=false)
     */
    private $dateCreated;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_updated", type="datetime", nullable=false)
     */
    private $dateUpdated;

    /**
     * @var int
     *
     * @ORM\Column(name="status", type="smallint", nullable=false)
     */
    private $status;

    /**
     * @var \Category
     *
     * @ORM\ManyToOne(targetEntity="Category")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_category", referencedColumnName="idCategory")
     * })
     */
    private $idCategory;

    /**
     * @var \Doctrine\Common\Collections\Collection
     *
     * @ORM\ManyToMany(targetEntity="Cast", inversedBy="idMovie")
     * @ORM\JoinTable(name="movie_has_cast",
     *   joinColumns={
     *     @ORM\JoinColumn(name="id_movie", referencedColumnName="idMovie")
     *   },
     *   inverseJoinColumns={
     *     @ORM\JoinColumn(name="id_cast", referencedColumnName="idCast")
     *   }
     * )
     */
    private $idCast;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->idCast = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getIdmovie(): ?int
    {
        return $this->idmovie;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getOriginaltitle(): ?string
    {
        return $this->originaltitle;
    }

    public function setOriginaltitle(string $originaltitle): self
    {
        $this->originaltitle = $originaltitle;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getRunningtime(): ?string
    {
        return $this->runningtime;
    }

    public function setRunningtime(string $runningtime): self
    {
        $this->runningtime = $runningtime;

        return $this;
    }

    public function getImgurl(): ?string
    {
        return $this->imgurl;
    }

    public function setImgurl(string $imgurl): self
    {
        $this->imgurl = $imgurl;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getDateCreated(): ?\DateTimeInterface
    {
        return $this->dateCreated;
    }

    public function setDateCreated(\DateTimeInterface $dateCreated): self
    {
        $this->dateCreated = $dateCreated;

        return $this;
    }

    public function getDateUpdated(): ?\DateTimeInterface
    {
        return $this->dateUpdated;
    }

    public function setDateUpdated(\DateTimeInterface $dateUpdated): self
    {
        $this->dateUpdated = $dateUpdated;

        return $this;
    }

    public function getStatus(): ?int
    {
        return $this->status;
    }

    public function setStatus(int $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getIdCategory(): ?Category
    {
        return $this->idCategory;
    }

    public function setIdCategory(?Category $idCategory): self
    {
        $this->idCategory = $idCategory;

        return $this;
    }

    /**
     * @return Collection|Cast[]
     */
    public function getIdCast(): Collection
    {
        return $this->idCast;
    }

    public function addIdCast(Cast $idCast): self
    {
        if (!$this->idCast->contains($idCast)) {
            $this->idCast[] = $idCast;
        }

        return $this;
    }

    public function removeIdCast(Cast $idCast): self
    {
        $this->idCast->removeElement($idCast);

        return $this;
    }

}
