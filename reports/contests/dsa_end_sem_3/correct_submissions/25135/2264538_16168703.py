def isPowerOfTwo(n):

    def rec(curr):
        if curr == n:
            return True
        if curr > n:
            return False
        
        return rec(curr * 2)
    
    return rec(1)