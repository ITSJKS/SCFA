def FindSqrt(x):
    left , right = 1,( x // 2 )+ 1

    if x == 1:
        return 1
        
    while left < right:

        mid = (left + right) // 2 

        if mid * mid <= x:
            left = mid + 1
        else: 
            right = mid
    return left - 1