def isPresent(n, nums, target):
    #write your code here
    l = 0
    r = n-1
    ans = -1
    while l<=r:
        m = (l+r)//2

        if nums[m]>=target:
            if nums[m]==target:
                ans = m
                break
            else:
                l = m+1
        else:
            r = m-1
    
    return ans