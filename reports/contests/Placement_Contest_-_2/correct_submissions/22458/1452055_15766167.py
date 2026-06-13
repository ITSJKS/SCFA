def FindSqrt(x):
    # Complete the code here
    s = 1
    e = x
    while s<=e:
        mid = (s+e)//2
        # print("*******")
        # print("x:", x)
        # print("s: ", s)
        # print('e: ', e)
        # print("mid :" , mid)
        # print("**********")
        
        if mid*mid <= x:
            if mid*mid == x:
                return mid  
            elif (mid+1)* (mid+1) > x:
                return mid
            else: 
                s = mid + 1
            
                 
        else:
            e = mid -1
            
    return -1