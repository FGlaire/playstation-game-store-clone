'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { getGames, deleteGame } from '@/lib/supabase'
import type { Game } from '@/lib/types'
import { EditGameForm } from './EditGameForm'
import { toast } from 'sonner'

export function GamesManagement() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadGames()
  }, [])

  async function loadGames() {
    const data = await getGames()
    setGames(data)
    setLoading(false)
  }

  const handleDelete = async (gameId: number) => {
    try {
      setIsLoading(true)
      const { error } = await deleteGame(gameId)
      if (error) throw error
      
      // Refresh games list after deletion
      const updatedGames = await getGames()
      setGames(updatedGames)
      toast("Game deleted successfully")
    } catch (error) {
      console.error('Error deleting game:', error)
      toast("Failed to delete game")
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return <div>Loading games...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.id}>
                <TableCell>{game.title}</TableCell>
                <TableCell>${game.price}</TableCell>
                <TableCell>{game.genre}</TableCell>
                <TableCell className="space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedGame(game)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Game</DialogTitle>
                      </DialogHeader>
                      <EditGameForm game={game} onSuccess={() => loadGames()} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(game.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 