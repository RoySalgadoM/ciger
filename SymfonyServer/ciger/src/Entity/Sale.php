<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Sale
 *
 * @ORM\Table(name="sale", indexes={@ORM\Index(name="fk_SALE_PERSON1_idx", columns={"id_person"}), @ORM\Index(name="fk_SALE_MOVIE1_idx", columns={"id_movie"})})
 * @ORM\Entity
 */
class Sale
{
    /**
     * @var int
     *
     * @ORM\Column(name="idSale", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $idsale;

    /**
     * @var string
     *
     * @ORM\Column(name="total", type="decimal", precision=10, scale=0, nullable=false)
     */
    private $total;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_sold", type="datetime", nullable=false)
     */
    private $dateSold;

    /**
     * @var \Person
     *
     * @ORM\ManyToOne(targetEntity="Person")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_person", referencedColumnName="idPerson")
     * })
     */
    private $idPerson;

    /**
     * @var \Movie
     *
     * @ORM\ManyToOne(targetEntity="Movie")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_movie", referencedColumnName="idMovie")
     * })
     */
    private $idMovie;

    public function getIdsale(): ?int
    {
        return $this->idsale;
    }

    public function getTotal(): ?string
    {
        return $this->total;
    }

    public function setTotal(string $total): self
    {
        $this->total = $total;

        return $this;
    }

    public function getDateSold(): ?\DateTimeInterface
    {
        return $this->dateSold;
    }

    public function setDateSold(\DateTimeInterface $dateSold): self
    {
        $this->dateSold = $dateSold;

        return $this;
    }

    public function getIdPerson(): ?Person
    {
        return $this->idPerson;
    }

    public function setIdPerson(?Person $idPerson): self
    {
        $this->idPerson = $idPerson;

        return $this;
    }

    public function getIdMovie(): ?Movie
    {
        return $this->idMovie;
    }

    public function setIdMovie(?Movie $idMovie): self
    {
        $this->idMovie = $idMovie;

        return $this;
    }


}
