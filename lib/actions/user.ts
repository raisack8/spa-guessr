'use server'

import { db, users, type NewUser } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// 新しいユーザーを作成（ゲスト用）
export async function createGuestUser(name?: string) {
  try {
    const guestName = name || `ゲスト${Math.floor(Math.random() * 10000)}`
    
    const newUser = await db
      .insert(users)
      .values({
        name: guestName,
        totalGames: 0,
        totalScore: 0,
        bestScore: 0,
        averageScore: '0'
      })
      .returning()

    return {
      success: true,
      data: newUser[0]
    }
  } catch (error) {
    console.error('Error creating guest user:', error)
    return {
      success: false,
      error: 'Failed to create guest user'
    }
  }
}

// ユーザー情報を取得
export async function getUser(userId: string) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (user.length === 0) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    return {
      success: true,
      data: user[0]
    }
  } catch (error) {
    console.error('Error getting user:', error)
    return {
      success: false,
      error: 'Failed to get user'
    }
  }
}

// ユーザー名を更新
export async function updateUserName(userId: string, name: string) {
  try {
    if (!name.trim()) {
      return {
        success: false,
        error: 'Name cannot be empty'
      }
    }

    if (name.length > 100) {
      return {
        success: false,
        error: 'Name is too long'
      }
    }

    const updatedUser = await db
      .update(users)
      .set({
        name: name.trim(),
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning()

    if (updatedUser.length === 0) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    revalidatePath('/rankings')
    
    return {
      success: true,
      data: updatedUser[0]
    }
  } catch (error) {
    console.error('Error updating user name:', error)
    return {
      success: false,
      error: 'Failed to update user name'
    }
  }
}

// ユーザーのアバターを更新
export async function updateUserAvatar(userId: string, avatar: string) {
  try {
    const updatedUser = await db
      .update(users)
      .set({
        avatar,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning()

    if (updatedUser.length === 0) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    revalidatePath('/rankings')
    
    return {
      success: true,
      data: updatedUser[0]
    }
  } catch (error) {
    console.error('Error updating user avatar:', error)
    return {
      success: false,
      error: 'Failed to update user avatar'
    }
  }
}

// ユーザー統計をリセット（開発用）
export async function resetUserStats(userId: string) {
  try {
    const updatedUser = await db
      .update(users)
      .set({
        totalGames: 0,
        totalScore: 0,
        bestScore: 0,
        averageScore: '0',
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning()

    if (updatedUser.length === 0) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    revalidatePath('/rankings')
    
    return {
      success: true,
      data: updatedUser[0]
    }
  } catch (error) {
    console.error('Error resetting user stats:', error)
    return {
      success: false,
      error: 'Failed to reset user stats'
    }
  }
}

// メールアドレスでユーザーを検索または作成
export async function findOrCreateUserByEmail(email: string, name?: string) {
  try {
    // 既存ユーザーを検索
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return {
        success: true,
        data: existingUser[0],
        isNew: false
      }
    }

    // 新しいユーザーを作成
    const newUser = await db
      .insert(users)
      .values({
        email,
        name: name || email.split('@')[0],
        totalGames: 0,
        totalScore: 0,
        bestScore: 0,
        averageScore: '0'
      })
      .returning()

    return {
      success: true,
      data: newUser[0],
      isNew: true
    }
  } catch (error) {
    console.error('Error finding or creating user by email:', error)
    return {
      success: false,
      error: 'Failed to find or create user'
    }
  }
}

// ユーザーを削除（GDPR対応）
export async function deleteUser(userId: string) {
  try {
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning()

    if (deletedUser.length === 0) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    revalidatePath('/rankings')
    
    return {
      success: true,
      data: { message: 'User deleted successfully' }
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    return {
      success: false,
      error: 'Failed to delete user'
    }
  }
} 