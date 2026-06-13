def isPresent(n, nums, target):
    if n==1:
        if nums[0]==target:
            return 0
        else:
            return -1
    else:
        s=0
        e=n-1
        while (s<=e):
            mid=(s+e)//2
            if nums[mid]==target:
                return mid
            elif nums[mid]>target:
                s=mid+1
            else:
                e=mid-1
        return -1