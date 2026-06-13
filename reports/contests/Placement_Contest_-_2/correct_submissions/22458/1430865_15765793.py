def FindSqrt(x):
    left = 0
    right = x

    while(left <= right):
        mid = (left + right) // 2
        if(mid * mid == x) or (mid * mid < x and (mid + 1) * (mid + 1) > x):
            return mid
        
        elif mid * mid < x:
            left = mid + 1
        
        else:
            right = mid - 1