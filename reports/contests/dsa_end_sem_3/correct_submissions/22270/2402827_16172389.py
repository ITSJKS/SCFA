def isPresent(n, nums, target):
    #write your code here
    left=0
    right=n-1
    
    while left<=right:
        mid=(left+right)//2
        if target==nums[mid]:
            return mid
        elif target>nums[mid]:
            right=mid-1
        else:
            left=mid+1
    return -1