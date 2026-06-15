def isPresent(n, nums, target):
    #write your code here
    a=-1
    s=0
    e=n-1
    while s<=e:
        m=(s+e)//2
        if nums[m]==target:
            a=m
            break
        elif nums[m]>target:
            s=m+1
        else:
            e=m-1
    return a