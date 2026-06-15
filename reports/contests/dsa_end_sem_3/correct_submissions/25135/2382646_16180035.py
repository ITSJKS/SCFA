def isPowerOfTwo(n):
    if n == 1:
        flag = True 
        return flag
    if n < 1:
        return False
    # if n == 0:
    #     return False
    

    return (isPowerOfTwo(n / 2))