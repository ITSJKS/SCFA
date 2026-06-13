def isPowerOfTwo(n):
    # if(n==1):
    #     return True
    # if(n/2==1):
    #     return True
    # if((n/2)%2!=0):
    #     return False
    # isPowerOfTwo(n/2)
    # return True
    if(n==1):
        return True
    if(n<1):
        return False
    return isPowerOfTwo(n/2)
    return False